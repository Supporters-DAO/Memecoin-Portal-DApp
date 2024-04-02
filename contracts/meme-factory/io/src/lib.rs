#![no_std]

use gstd::{ prelude::*, ActorId, CodeId };
use gmeta::{In,Out,InOut,Metadata};

pub type MemeId = u64;


#[derive(Encode, Decode, TypeInfo, Debug)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum MemeFactoryAction {
    CreateMeme{
        name: String,      
        symbol: String,    
        decimals: u8,
        admin: ActorId,
        image:String
    },
    MintMeme{
        amount: u128,
        to:ActorId,
        meme_id:MemeId
    },
    BurnMeme{
        amount: u128,
        from:ActorId,
        meme_id:MemeId
    },
    TransferMeme {
        from: ActorId,
        to: ActorId,
        amount: u128,
        meme_id:MemeId
    },
    ApproveMeme {
        to: ActorId,
        amount: u128,
        meme_id:MemeId
    },
    AddAdmin {
        meme_id: MemeId, 
        admin_actor_id:ActorId
    },
}

#[derive(Encode, Decode, TypeInfo,Clone, Debug)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct MemeRecord {
  pub  name: String,      
  pub  symbol: String,    
  pub  decimals: u8,
  pub  image: String ,
  pub  creator:ActorId,
  pub  meme_program_id: ActorId,
  pub  admins: Vec<ActorId>
}

#[derive(Encode, Decode, TypeInfo, Debug)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum MemeFactoryEvent {
    MemeCreated { 
        meme_id: MemeId, 
        meme_address: ActorId },
    TokensMinted { 
        amount: u128, 
        actor_id: ActorId 
    },
    TokensBurned { 
        amount: u128, 
        actor_id: ActorId 
    },
    TokensTransferred { 
        amount: u128, 
        from_actor_id:ActorId,
        to_actor_id: ActorId
    },
    TokensApproved 
    { 
        amount: u128, 
        approver_actor_id: ActorId, 
        to_actor_id: ActorId }
    ,
    MemeRegistered,
    MemeFailed,
    AdminAdded
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum MemeError {
    ProgramInitializationFailed,
    ProgramInitializationFailedWithContext(String), 
    Unauthorized,
    UnexpectedFTEvent,
    MessageSendError,
    MemeNotFound,
}


#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum FTAction {
    Mint {
        amount: u128,
        to: ActorId,
    },
    Burn {
        amount: u128,
        from: ActorId,
    },
    Transfer {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Approve {
        to: ActorId,
        amount: u128,
    },
    TotalSupply,
    BalanceOf(ActorId),
    AddAdmin {
        admin: ActorId,
    }
}

#[derive(Debug, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum FTEvent {
    Transfer {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Approve {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    TotalSupply(u128),
    Balance(u128),
    AdminAdded
}


#[derive(Decode, Encode, TypeInfo, Clone)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct IoMemeFactory{
    pub meme_number: MemeId,
    pub meme_code_id: CodeId,
    pub all_memecoins:Vec<(MemeId,MemeRecord)>,
    pub id_to_address: Vec<(MemeId, ActorId)>,
    pub memecoins: Vec<(ActorId, Vec<(MemeId,MemeRecord)>)>, 
}


#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitConfig {
    pub name: String,
    pub symbol: String,
    pub admin: ActorId,
    pub decimals: u8,
}

pub struct ContractMetadata;

impl Metadata for ContractMetadata{
     type Init = In<CodeId>;
     type Handle = InOut<MemeFactoryAction, Result<MemeFactoryEvent,MemeError>>;
     type Others = ();
     type Reply=();
     type Signal = ();
     type State = Out<IoMemeFactory>;

}