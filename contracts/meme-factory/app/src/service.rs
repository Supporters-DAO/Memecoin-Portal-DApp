use alloc::{
    string::{String, ToString},
    vec::Vec,
};
use gstd::{exec, msg, collections::HashMap, prog::ProgramGenerator, ActorId, CodeId};
use parity_scale_codec::{Decode, Encode};
use primitive_types::U256;
use sails_rs::gstd::service;
use sails_rs::{Box, format};
use scale_info::TypeInfo;

static mut DATA: Option<MemeFactoryData> = None;

pub type MemeId = u64;

#[derive(Encode, Decode, TypeInfo, Clone, Debug)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct MemeRecord {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub meme_program_id: ActorId,
    pub admins: Vec<ActorId>,
}

#[derive(Encode, Decode, TypeInfo, Debug, Eq, PartialEq)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum MemeFactoryEvent {
    MemeCreated {
        meme_id: MemeId,
        meme_address: ActorId,
        init: Init,
    },
    MemeRemoved {
        removed_by: ActorId,
        meme_id: MemeId,
    },
    GasUpdatedSuccessfully {
        updated_by: ActorId,
        new_gas_amount: u64,
    },
    CodeIdUpdatedSuccessfully {
        updated_by: ActorId,
        new_code_id: CodeId,
    },
    AdminAdded {
        updated_by: ActorId,
        admin_actor_id: ActorId,
    },
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, Eq, PartialEq)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum MemeError {
    ProgramInitializationFailedWithContext(String),
    Unauthorized,
    MemeExists,
    MemeNotFound,
    InsufficientValue,
}

#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitConfigFactory {
    pub meme_code_id: CodeId,
    pub factory_admin_account: Vec<ActorId>,
    pub gas_for_program: u64,
}

#[derive(Clone, Debug, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct Init {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub description: String,
    pub external_links: ExternalLinks,
    pub initial_supply: U256,
    pub max_supply: U256,
    pub admin_id: ActorId,
}

#[derive(Clone, Debug, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct ExternalLinks {
    pub image: String,
    pub website: Option<String>,
    pub telegram: Option<String>,
    pub twitter: Option<String>,
    pub discord: Option<String>,
    pub tokenomics: Option<String>,
}

#[derive(Debug, Default)]
pub struct MemeFactoryData {
    pub meme_number: MemeId,
    pub meme_code_id: CodeId,
    pub admins: Vec<ActorId>,
    pub gas_for_program: u64,
    // used for `state` entrypoint
    pub id_to_address: HashMap<MemeId, ActorId>,
    pub meme_coins: HashMap<ActorId, Vec<(MemeId, MemeRecord)>>,
}

impl MemeFactoryData {
    pub fn get_mut() -> &'static mut Self {
        unsafe { DATA.as_mut().expect("MemeFactory::seed() should be called") }
    }
    pub fn get() -> &'static Self {
        unsafe { DATA.as_ref().expect("MemeFactory::seed() should be called") }
    }
}

#[derive(Clone)]
pub struct MemeFactory();

#[service(events = MemeFactoryEvent)]
impl MemeFactory {
    pub fn seed(config: InitConfigFactory) {
        unsafe {
            DATA = Some(MemeFactoryData {
                meme_number: 0,
                meme_code_id: config.meme_code_id,
                admins: config.factory_admin_account,
                gas_for_program: config.gas_for_program,
                ..Default::default()
            });
        }
    }

    pub fn new() -> Self {
        Self()
    }

    fn check_admin(&self, data: &MemeFactoryData, id: ActorId) -> Result<(), MemeError> {
        if data.admins.contains(&id) {
            Ok(())
        } else {
            Err(MemeError::Unauthorized)
        }
    }

    pub async fn create_fungible_program(&mut self, init: Init) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();
        let source = msg::source();
        let ed = exec::env_vars().existential_deposit;
        if msg::value() < ed {
            return Err(MemeError::InsufficientValue);
        }
        for meme_records in data.meme_coins.values() {
            for (_, meme_record) in meme_records {
                if meme_record.name == init.name {
                    return Err(MemeError::MemeExists);
                }
            }
        }
        let payload = ["New".encode(), init.encode()].concat();
        let create_program_future = ProgramGenerator::create_program_bytes_with_gas_for_reply(
            data.meme_code_id,
            payload,
            data.gas_for_program,
            0,
            10_000_000_000,
        )
        .map_err(|e| MemeError::ProgramInitializationFailedWithContext(e.to_string()))?;

        let (address, _) = create_program_future
            .await
            .map_err(|e| MemeError::ProgramInitializationFailedWithContext(e.to_string()))?;

        data.meme_number = data.meme_number.saturating_add(1);

        data.id_to_address
            .entry(data.meme_number)
            .or_insert(address);

        let meme_record = MemeRecord {
            name: init.name.clone(),
            symbol: init.symbol.clone(),
            decimals: init.decimals,
            meme_program_id: address,
            admins: [init.admin_id].to_vec(),
        };

        data.meme_coins
            .entry(source)
            .or_default()
            .push((data.meme_number, meme_record));

        let _ = self.notify_on(MemeFactoryEvent::MemeCreated {
            meme_id: data.meme_number,
            meme_address: address,
            init,
        });

        Ok(())
    }

    pub fn update_gas_for_program(&mut self, new_gas_amount: u64) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();
        let source = msg::source();

        self.check_admin(data, source)?;

        data.gas_for_program = new_gas_amount;

        let _ = self.notify_on(MemeFactoryEvent::GasUpdatedSuccessfully {
            updated_by: source,
            new_gas_amount,
        });
        Ok(())
    }

    pub fn update_code_id(&mut self, new_code_id: CodeId) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();
        let source = msg::source();

        self.check_admin(data, source)?;

        data.meme_code_id = new_code_id;

        let _ = self.notify_on(MemeFactoryEvent::CodeIdUpdatedSuccessfully {
            updated_by: source,
            new_code_id,
        });
        Ok(())
    }

    pub fn add_admin_to_factory(&mut self, admin_actor_id: ActorId) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();
        let source = msg::source();

        self.check_admin(data, source)?;

        data.admins.push(admin_actor_id);

        let _ = self.notify_on(MemeFactoryEvent::AdminAdded {
            updated_by: source,
            admin_actor_id,
        });
        Ok(())
    }

    pub fn remove_meme(&mut self, meme_id: MemeId) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();
        let source = msg::source();

        self.check_admin(data, source)?;

        let mut is_meme_removed = false;

        for (_actor_id, memes) in data.meme_coins.iter_mut() {
            if let Some(pos) = memes.iter().position(|(id, _)| *id == meme_id) {
                memes.remove(pos);
                is_meme_removed = true;
                break;
            }
        }

        if !is_meme_removed {
            return Err(MemeError::MemeNotFound);
        }

        let address = data.id_to_address.remove(&meme_id);
        debug_assert!(address.is_some());

        let _ = self.notify_on(MemeFactoryEvent::MemeRemoved {
            removed_by: source,
            meme_id,
        });

        Ok(())
    }

    pub fn mem_number(&self) -> u64 {
        MemeFactoryData::get().meme_number
    }
    pub fn meme_code_id(&self) -> CodeId {
        MemeFactoryData::get().meme_code_id
    }
    pub fn admins(&self) -> Vec<ActorId> {
        MemeFactoryData::get().admins.clone()
    }
    pub fn gas_for_program(&self) -> u64 {
        MemeFactoryData::get().gas_for_program
    }
    pub fn id_to_address(&self) -> Vec<(MemeId, ActorId)> {
        MemeFactoryData::get()
            .id_to_address
            .iter()
            .map(|(&meme_id, &actor_id)| (meme_id, actor_id))
            .collect()
    }
    pub fn meme_coins(&self) -> Vec<(ActorId, Vec<(MemeId, MemeRecord)>)> {
        MemeFactoryData::get()
            .meme_coins
            .iter()
            .map(|(&actor_id, records)| (actor_id, records.clone()))
            .collect()
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use alloc::vec;
//     use sails_rtl::{gstd::events::mocks::MockEventTrigger, MessageId};

//     const DEFAULT_ADMIN_ID: u64 = 1;

//     fn admin() -> &'static mut sails_rtl::ActorId {
//         static mut ADMIN: Option<sails_rtl::ActorId> = None;
//         unsafe { ADMIN.get_or_insert(sails_rtl::ActorId::from(DEFAULT_ADMIN_ID)) }
//     }

//     #[derive(Clone)]
//     struct MockExecContext;

//     impl ExecContext for MockExecContext {
//         fn actor_id(&self) -> sails_rtl::ActorId {
//             *admin()
//         }

//         fn message_id(&self) -> MessageId {
//             unimplemented!()
//         }
//     }

//     fn init() {
//         MemeFactory::<MockExecContext, MockEventTrigger<MemeFactoryEvent>>::seed(
//             InitConfigFactory {
//                 meme_code_id: CodeId::new([0xfe; 32]),
//                 factory_admin_account: vec![DEFAULT_ADMIN_ID.into()],
//                 gas_for_program: 0,
//             },
//         );

//         // init admin
//         admin();
//     }

//     #[test]
//     fn update_code_id() {
//         init();

//         let mut service = MemeFactory::new(MockExecContext, MockEventTrigger::new());

//         service.update_code_id(CodeId::default()).unwrap();
//         assert_eq!(MemeFactoryData::get_mut().meme_code_id, CodeId::default());

//         *admin() = sails_rtl::ActorId::from(0);
//         assert_eq!(
//             service.update_code_id(CodeId::new([0xaa; 32])),
//             Err(MemeError::Unauthorized)
//         );
//         assert_eq!(MemeFactoryData::get_mut().meme_code_id, CodeId::default());
//     }

//     #[test]
//     fn update_gas_for_program() {
//         init();

//         let mut service = MemeFactory::new(MockExecContext, MockEventTrigger::new());

//         service.update_gas_for_program(1_000).unwrap();
//         assert_eq!(MemeFactoryData::get_mut().gas_for_program, 1_000);

//         *admin() = sails_rtl::ActorId::from(0);
//         assert_eq!(
//             service.update_gas_for_program(555_555),
//             Err(MemeError::Unauthorized)
//         );
//         assert_eq!(MemeFactoryData::get_mut().gas_for_program, 1_000);
//     }

//     #[test]
//     fn add_admin_to_factory() {
//         init();

//         let mut service = MemeFactory::new(MockExecContext, MockEventTrigger::new());

//         let new_admin = ActorId::new([0xcc; 32]);
//         service.add_admin_to_factory(new_admin).unwrap();
//         assert_eq!(
//             MemeFactoryData::get_mut().admins,
//             vec![DEFAULT_ADMIN_ID.into(), new_admin]
//         );

//         *admin() = sails_rtl::ActorId::from(0);
//         assert_eq!(
//             service.update_gas_for_program(555_555),
//             Err(MemeError::Unauthorized)
//         );
//         assert_eq!(
//             MemeFactoryData::get_mut().admins,
//             vec![DEFAULT_ADMIN_ID.into(), new_admin]
//         );
//     }

//     #[test]
//     fn remove_meme() {
//         const MEME_ID: u64 = 2;

//         init();

//         let mut service = MemeFactory::new(MockExecContext, MockEventTrigger::new());

//         let data = MemeFactoryData::get_mut();
//         data.meme_coins.insert(
//             ActorId::new([0xee; 32]),
//             vec![(
//                 MEME_ID,
//                 MemeRecord {
//                     name: "".to_string(),
//                     symbol: "".to_string(),
//                     decimals: 0,
//                     meme_program_id: Default::default(),
//                     admins: vec![],
//                 },
//             )],
//         );
//         data.id_to_address.insert(MEME_ID, ActorId::zero());

//         service.remove_meme(MEME_ID).unwrap();

//         assert_eq!(service.remove_meme(MEME_ID), Err(MemeError::MemeNotFound));

//         assert_eq!(
//             service.remove_meme(0xdeadbeef),
//             Err(MemeError::MemeNotFound)
//         );

//         *admin() = sails_rtl::ActorId::from(123);
//         assert_eq!(
//             service.remove_meme(0xdeadbeef),
//             Err(MemeError::Unauthorized)
//         );
//     }
// }
