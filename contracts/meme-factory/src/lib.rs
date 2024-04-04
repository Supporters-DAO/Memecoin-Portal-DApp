#![no_std]
use gstd::{
    async_main, collections::HashMap, msg, prelude::*, prog::ProgramGenerator, ActorId, CodeId,
};
use io::*;

#[cfg(feature = "binary-vendor")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

static mut MEME_FACTORY: Option<MemeFactory> = None;

pub type MemeId = u64;

#[derive(Debug, Default)]
pub struct MemeFactory {
    pub meme_number: MemeId,
    pub meme_code_id: CodeId,
    pub factory_admin_account: Vec<ActorId>,
    pub gas_for_program: u64,
    pub id_to_address: HashMap<MemeId, ActorId>,
    pub memecoins: HashMap<ActorId, Vec<(MemeId, MemeRecord)>>,
}

impl MemeFactory {
    pub async fn create_fungible_program(
        &mut self,
        init_config: InitConfig,
    ) -> Result<MemeFactoryEvent, MemeError> {
        for meme_records in self.memecoins.values() {
            for (_, meme_record) in meme_records {
                if meme_record.name == init_config.name {
                    return Err(MemeError::Unauthorized);
                }
            }
        }

        let create_program_future =
            ProgramGenerator::create_program_with_gas_for_reply::<InitConfig>(
                self.meme_code_id,
                InitConfig {
                    name: init_config.name.clone(),
                    symbol: init_config.symbol.clone(),
                    decimals: init_config.decimals.clone(),
                    description: init_config.description.clone(),
                    external_links: init_config.external_links.clone(),
                    initial_supply: init_config.initial_supply.clone(),
                    admin: init_config.admin.clone(),
                    initial_capacity: init_config.initial_capacity.clone(),
                    config: init_config.config.clone(),
                },
                self.gas_for_program,
                0,
                0,
            )
            .map_err(|e| MemeError::ProgramInitializationFailedWithContext(e.to_string()))?;

        let (address, _) = create_program_future
            .await
            .map_err(|e| MemeError::ProgramInitializationFailedWithContext(e.to_string()))?;

        self.meme_number = self.meme_number.saturating_add(1);

        self.id_to_address
            .entry(self.meme_number)
            .or_insert(address);

        let meme_record = MemeRecord {
            name: init_config.name.clone(),
            symbol: init_config.symbol.clone(),
            decimals: init_config.decimals,
            meme_program_id: address,
            admins: [init_config.admin.clone()].to_vec(),
        };

        let memecoins_for_actor = self.memecoins.entry(msg::source()).or_default();
        memecoins_for_actor.push((self.meme_number, meme_record.clone()));

        Ok(MemeFactoryEvent::MemeCreated {
            meme_id: self.meme_number,
            meme_address: address,
            init_config: init_config,
        })
    }

    pub fn update_gas_for_program(
        &mut self,
        new_gas_amount: u64,
    ) -> Result<MemeFactoryEvent, MemeError> {
        if self.factory_admin_account.contains(&msg::source()) {
            self.gas_for_program = new_gas_amount;
            Ok(MemeFactoryEvent::GasUpdatedSuccessfully {
                updated_by: msg::source(),
                new_gas_amount,
            })
        } else {
            return Err(MemeError::Unauthorized);
        }
    }

    pub fn update_code_id(&mut self, new_code_id: CodeId) -> Result<MemeFactoryEvent, MemeError> {
        if self.factory_admin_account.contains(&msg::source()) {
            self.meme_code_id = new_code_id;
            Ok(MemeFactoryEvent::CodeIdUpdatedSuccessfully {
                updated_by: msg::source(),
                new_code_id,
            })
        } else {
            return Err(MemeError::Unauthorized);
        }
    }

    pub fn add_admin_to_factory(
        &mut self,
        admin_actor_id: ActorId,
    ) -> Result<MemeFactoryEvent, MemeError> {
        if self.factory_admin_account.contains(&msg::source()) {
            self.factory_admin_account.push(admin_actor_id);

            Ok(MemeFactoryEvent::AdminAdded {
                updated_by: msg::source(),
                admin_actor_id,
            })
        } else {
            return Err(MemeError::Unauthorized);
        }
    }
}

#[no_mangle]
extern "C" fn init() {
    let init_config_factory: InitConfigFactory =
        msg::load().expect("Unable to decode CodeId of the Meme program");

    let meme_factory = MemeFactory {
        meme_number: 0,
        meme_code_id: init_config_factory.meme_code_id,
        factory_admin_account: init_config_factory.factory_admin_account,
        gas_for_program: init_config_factory.gas_for_program,
        ..Default::default()
    };
    unsafe { MEME_FACTORY = Some(meme_factory) };
}

#[async_main]
async fn main() {
    let action: MemeFactoryAction = msg::load().expect("Could not load Action");

    let factory_state = unsafe {
        MEME_FACTORY
            .as_mut()
            .expect("Unexpected error in factory_state")
    };

    let result = match action {
        MemeFactoryAction::CreateMeme { init_config } => {
            factory_state.create_fungible_program(init_config).await
        }
        MemeFactoryAction::AddAdmin { admin_actor_id } => {
            factory_state.add_admin_to_factory(admin_actor_id)
        }
        MemeFactoryAction::UpdateGasProgram(new_gas_amount) => {
            factory_state.update_gas_for_program(new_gas_amount)
        }
        MemeFactoryAction::CodeIdUpdate { new_code_id } => {
            factory_state.update_code_id(new_code_id)
        }
    };

    msg::reply(result, 0)
        .expect("Failed to encode or reply with `Result<MemeFactoryEvent, MemeError>`");
}

#[no_mangle]
extern "C" fn state() {
    let factory_state = unsafe {
        MEME_FACTORY
            .take()
            .expect("Unexpected error in taking state")
    };
    let query: Query = msg::load().expect("Unable to decode the query");
    let reply = match query {
        Query::MemeNumber => QueryReply::MemeNumber(factory_state.meme_number),
        Query::MemeCodeId => QueryReply::MemeCodeId(factory_state.meme_code_id),
        Query::FactoryAdminAccount => {
            QueryReply::FactoryAdminAccount(factory_state.factory_admin_account)
        }
        Query::GasForProgram => QueryReply::GasForProgram(factory_state.gas_for_program),
        Query::IdToAddress => {
            QueryReply::IdToAddress(factory_state.id_to_address.into_iter().collect())
        }

        Query::Memecoins => QueryReply::Memecoins(factory_state.memecoins.into_iter().collect()),
    };
    msg::reply(reply, 0).expect("Error on state");
}
