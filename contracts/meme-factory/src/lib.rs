
#![no_std]
use gstd::{prog::ProgramGenerator, CodeId,msg,async_main, collections::HashMap, prelude::*,ActorId};
use io::*;

#[cfg(feature = "binary-vendor")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));


static mut MEME_FACTORY:Option<MemeFactory> = None;

const GAS_FOR_PROGRAM: u64 = 1_000_000_000;
pub type MemeId = u64;

fn state_mut() -> &'static mut MemeFactory {

    let state = unsafe {  MEME_FACTORY.as_mut()};

    unsafe { state.unwrap_unchecked() }

}


#[derive(Debug, Default)]
pub struct MemeFactory {
    pub meme_number: MemeId,
    pub meme_code_id: CodeId,
    pub all_memecoins:Vec<(MemeId,MemeRecord)>,
    pub id_to_address: HashMap<MemeId, ActorId>,
    pub memecoins: HashMap<ActorId, Vec<(MemeId,MemeRecord)>>, 
}



impl MemeFactory {

    pub async fn create_fungible_program(&mut self, name: String, symbol: String,  decimals: u8, admin:ActorId, image: String) -> Result<MemeFactoryEvent, MemeError> {
        let create_program_future = ProgramGenerator::create_program_with_gas_for_reply::<InitConfig>(
            self.meme_code_id,
            InitConfig {
                name: name.clone(),
                symbol: symbol.clone(),
                admin: admin.clone(),
                decimals:decimals.clone(),
            },
            GAS_FOR_PROGRAM,
            0,
            5_000_000_000,
        ).map_err(|e| MemeError::ProgramInitializationFailedWithContext(e.to_string()))?;
    
        let (address, _) = create_program_future.await.map_err(|e| MemeError::ProgramInitializationFailedWithContext(e.to_string()))?;
    
        self.meme_number = self.meme_number.saturating_add(1);

        self.id_to_address.entry(self.meme_number).or_insert(address);
    
        let meme_record = MemeRecord {
            name:name,
            symbol: symbol,
            decimals:decimals,
            image: image,
            creator:msg::source(),
            meme_program_id: address,
            admins:[admin].to_vec()
        };
    
        self.insert_into_all_memecoins(self.meme_number, &meme_record)?;
        self.insert_into_memecoins(msg::source(), self.meme_number, &meme_record)?;
    
        Ok(MemeFactoryEvent::MemeCreated { meme_id: self.meme_number, meme_address: address })
    }
    
    
    
    pub fn insert_into_all_memecoins(&mut self, meme_id: MemeId, meme_record: &MemeRecord) -> Result<MemeFactoryEvent, MemeError> {
        
        self.all_memecoins.push((meme_id, meme_record.clone()));
        Ok(MemeFactoryEvent::MemeRegistered)
    }
    
    
    pub fn insert_into_memecoins(&mut self, actor_id: ActorId, meme_id: MemeId, meme_record: &MemeRecord) -> Result<MemeFactoryEvent, MemeError> {
     
        let memecoins_for_actor = self.memecoins.entry(actor_id).or_insert_with(Vec::new);
    
        memecoins_for_actor.push((meme_id, meme_record.clone()));
    
        Ok(MemeFactoryEvent::MemeRegistered)
    }

    pub async fn mint_meme_tokens(&mut self, amount: u128, to: ActorId  ,meme_id: MemeId) -> Result<MemeFactoryEvent, MemeError> {
   
        if !self.is_admin( meme_id) {
            return Err(MemeError::Unauthorized);
        }
    
        if let Some(meme_program_id) = self.find_meme_program_id_by_meme_id(meme_id) {
            
        let payload = FTAction::Mint{ amount: amount , to: to };
        let actor_id = msg::source();
    
        let future_result = msg::send_for_reply_as::<_, FTEvent>(meme_program_id, payload, 0, 0);
    
        match future_result {
            Ok(future) => {
                match future.await {
                    Ok(event) => match event {
                        FTEvent::Transfer {
                            from:_,
                            to:_,
                            amount:_,
                        } => {
                            Ok(MemeFactoryEvent::TokensMinted { amount: amount, actor_id })
                        },
                        _ => Err(MemeError::UnexpectedFTEvent),
                    },
                    Err(_) => Err(MemeError::MessageSendError),
                }
            },
            Err(_) => Err(MemeError::MessageSendError),
        }

        } else {
            Err(MemeError::MemeNotFound)
        }
    }
    
    
    
    

    pub async fn burn_meme_tokens(&mut self, amount: u128, from: ActorId , meme_id: MemeId) -> Result<MemeFactoryEvent, MemeError> {
        
        if !self.is_admin( meme_id) {
            return Err(MemeError::Unauthorized);
        }
    
        if let Some(meme_program_id) = self.find_meme_program_id_by_meme_id(meme_id) {
            
        let payload = FTAction::Burn{ amount: amount, from: from };
        let actor_id = msg::source();
    
        let future_result = msg::send_for_reply_as::<_, FTEvent>(meme_program_id, payload, 0, 0);
    
        match future_result {
            Ok(future) => {
                match future.await {
                    Ok(event) => match event {
                        FTEvent::Transfer {
                            from:_,
                            to:_,
                            amount:_,
                        } => {
                            Ok(MemeFactoryEvent::TokensBurned { amount: amount, actor_id })
                        },
                        _ => Err(MemeError::UnexpectedFTEvent),
                    },
                    Err(_) => Err(MemeError::MessageSendError),
                }
            },
            Err(_) => Err(MemeError::MessageSendError),
        }

        } else {
            Err(MemeError::MemeNotFound)
        }
    }
    

    pub async fn transfer_meme_tokens(&mut self, from_actor_id: ActorId, to_actor_id: ActorId, amount: u128, meme_id: MemeId) -> Result<MemeFactoryEvent, MemeError> {
        
        if !self.is_admin( meme_id) {
            return Err(MemeError::Unauthorized);
        }
    
        if let Some(meme_program_id) = self.find_meme_program_id_by_meme_id(meme_id) {
            
            let payload = FTAction::Transfer { from: from_actor_id, to: to_actor_id, amount };
        
            let future_result = msg::send_for_reply_as::<_, FTEvent>(meme_program_id, payload, 0, 0);
    
        match future_result {
            Ok(future) => {
                match future.await {
                    Ok(event) => match event {
                        FTEvent::Transfer {
                            from:_,
                            to:_,
                            amount:_,
                        } => {
                            Ok(MemeFactoryEvent::TokensTransferred { amount, from_actor_id, to_actor_id })
                        },
                        _ => Err(MemeError::UnexpectedFTEvent),
                    },
                    Err(_) => Err(MemeError::MessageSendError),
                }
            },
            Err(_) => Err(MemeError::MessageSendError),
        }

        } else {
            Err(MemeError::MemeNotFound)
        }
    }
    


    pub async fn approve_meme_tokens(&mut self, to_actor_id: ActorId, amount: u128, meme_id: MemeId) -> Result<MemeFactoryEvent, MemeError> {
        
        if !self.is_admin( meme_id) {
            return Err(MemeError::Unauthorized);
        }
    
        if let Some(meme_program_id) = self.find_meme_program_id_by_meme_id(meme_id) {
            
            let payload = FTAction::Approve { to: to_actor_id, amount };
            let approver_actor_id = msg::source(); 
    
            let future_result = msg::send_for_reply_as::<_, FTEvent>(meme_program_id, payload, 0, 0);
    
        match future_result {
            Ok(future) => {
                match future.await {
                    Ok(event) => match event {
                        FTEvent::Approve {
                            from:_,
                            to:_,
                            amount:_,
                        }  => {
                            Ok(MemeFactoryEvent::TokensApproved { amount, approver_actor_id, to_actor_id })
                        },
                        _ => Err(MemeError::UnexpectedFTEvent),
                    },
                    Err(_) => Err(MemeError::MessageSendError),
                }
            },
            Err(_) => Err(MemeError::MessageSendError),
        }

        } else {
            Err(MemeError::MemeNotFound)
        }
    }


    pub async fn add_admin_to_memecoin(&mut self, meme_id: MemeId, admin_actor_id:ActorId) -> Result<MemeFactoryEvent, MemeError> {

        if !self.is_admin( meme_id) {
            return Err(MemeError::Unauthorized);
        }
    
        if let Some(meme_program_id) = self.find_meme_program_id_by_meme_id(meme_id) {
            
        let payload = FTAction::AddAdmin {
            admin:admin_actor_id ,
        };
  
    
        let future_result = msg::send_for_reply_as::<_, FTEvent>(meme_program_id, payload, 0, 0);
    
        match future_result {
            Ok(future) => {
                match future.await {
                    Ok(event) => match event {
                        FTEvent::AdminAdded => {
                            let _ = self.add_admin(meme_id, admin_actor_id );
                            Ok(MemeFactoryEvent::AdminAdded)
                        },
                        _ => Err(MemeError::UnexpectedFTEvent),
                    },
                    Err(_) => Err(MemeError::MessageSendError),
                }
            },
            Err(_) => Err(MemeError::MessageSendError),
        }

        } else {
            Err(MemeError::MemeNotFound)
        }





    }




    fn is_admin(&self, meme_id: MemeId) -> bool {

        for (_, meme_records) in self.memecoins.iter() {
            if let Some((_, meme_record)) = meme_records.iter().find(|(id, _)| *id == meme_id) {
                if meme_record.admins.contains(&msg::source()) {
                    return true; 
                }
            }
        }
        false 
    }


    fn find_meme_program_id_by_meme_id(&self, meme_id: MemeId) -> Option<ActorId> {
        self.id_to_address.get(&meme_id).copied()
    }


    fn add_admin(&mut self, meme_id: MemeId, admin_actor_id:ActorId) -> Result<MemeFactoryEvent, MemeError>  {


        if !self.is_admin(meme_id) {
            return Err(MemeError::Unauthorized);
        }
    
     
        if let Some(meme_record) = self.all_memecoins.iter_mut().find(|(id, _)| *id == meme_id).map(|(_, record)| record) {

            if !meme_record.admins.contains(&admin_actor_id) {

                 meme_record.admins.push(admin_actor_id);
                    }
                            } else {
                                    return Err(MemeError::MemeNotFound);
                                    }
    
            
        for meme_list in self.memecoins.values_mut() {
                for (id, meme_record) in meme_list {
                    if meme_id.clone() == *id && !meme_record.admins.contains(&admin_actor_id) {
                        meme_record.admins.push(admin_actor_id);
                    }
                }
            }

        Ok(MemeFactoryEvent::AdminAdded)

            
       
    }

}

#[no_mangle]
extern "C" fn init () {

    let meme_code_id: CodeId = msg::load()
        .expect("Unable to decode CodeId of the Meme program");
    let meme_factory = MemeFactory {
        meme_number:0,
        meme_code_id,
        ..Default::default()
    };
    unsafe { MEME_FACTORY = Some(meme_factory) };


}

#[async_main]
async fn main(){

     let action: MemeFactoryAction = msg::load().expect("Could not load Action");

     let factory_state = state_mut();

     let result = match action {
        MemeFactoryAction::CreateMeme{name, symbol, decimals,  admin, image } => {

            let result = factory_state.create_fungible_program(name, symbol, decimals,  admin, image).await;

            result
         
         }
         MemeFactoryAction::MintMeme{ amount, to,  meme_id } => {

            let result = factory_state.mint_meme_tokens(amount, to, meme_id).await;

            result

         }
         MemeFactoryAction::BurnMeme{ amount, from, meme_id } =>{

            let result = factory_state.burn_meme_tokens(amount, from, meme_id).await;

            result
            
         }
         MemeFactoryAction::TransferMeme{ from, to, amount, meme_id}  =>{

            let result =   factory_state.transfer_meme_tokens(from, to, amount, meme_id ).await;

            result
            
         }
         MemeFactoryAction::ApproveMeme { to, amount, meme_id } =>{

            let result =  factory_state.approve_meme_tokens(to, amount, meme_id).await;

            result
            
         }
         MemeFactoryAction::AddAdmin { meme_id, admin_actor_id } => {

            let result =  factory_state.add_admin_to_memecoin(meme_id, admin_actor_id).await;
            
            result
         }

       
        };
    
        msg::reply(result, 0).expect("Failed to encode or reply with `Result<MemeFactoryEvent, MemeError>`");
    }

         
    

    
#[no_mangle]
extern "C" fn state() {
   
    let state = unsafe { MEME_FACTORY.take().expect("Unexpected error in taking state") };

    msg::reply::<IoMemeFactory>(state.into(), 0)
    .expect("Failed to encode or reply with `<ContractMetadata as Metadata>::State` from `state()`");
    
}

impl From<MemeFactory> for IoMemeFactory {

    fn from(value: MemeFactory) -> Self {
        let MemeFactory {
            meme_number,
            meme_code_id,
            all_memecoins,
            id_to_address,
            memecoins, 
                } = value;
        
        let  id_to_address =  id_to_address.iter().map(|(k, v)| (*k, v.clone())).collect();
        let memecoins = memecoins.iter().map(|(k, v)| (*k, v.clone())).collect();
        Self {
            meme_number,
            meme_code_id,
            all_memecoins,
            id_to_address,
            memecoins, 
        }
    }
}