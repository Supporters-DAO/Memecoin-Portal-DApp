use alloc::{
    boxed::Box,
    string::{String, ToString},
    vec::Vec,
};
use fungible_token_io::InitConfig;
use gstd::{collections::HashMap, prog::ProgramGenerator, ActorId, CodeId};
use parity_scale_codec::{Decode, Encode};
use sails_macros::gservice;
use sails_rtl::{gstd::events::EventTrigger, ExecContext};
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
        init_config: Box<InitConfig>,
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

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum MemeError {
    ProgramInitializationFailedWithContext(String),
    Unauthorized,
    MemeExists,
}

#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitConfigFactory {
    pub meme_code_id: CodeId,
    pub factory_admin_account: Vec<ActorId>,
    pub gas_for_program: u64,
}

#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum Query {
    MemeNumber,
    MemeCodeId,
    FactoryAdminAccount,
    GasForProgram,
    IdToAddress,
    Memecoins,
}

#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum QueryReply {
    MemeNumber(MemeId),
    MemeCodeId(CodeId),
    FactoryAdminAccount(Vec<ActorId>),
    GasForProgram(u64),
    IdToAddress(Vec<(MemeId, ActorId)>),
    Memecoins(Vec<(ActorId, Vec<(MemeId, MemeRecord)>)>),
}

#[derive(Debug, Default)]
pub struct MemeFactoryData {
    pub meme_number: MemeId,
    pub meme_code_id: CodeId,
    pub admins: Vec<ActorId>,
    pub gas_for_program: u64,
    pub id_to_address: HashMap<MemeId, ActorId>,
    pub meme_coins: HashMap<ActorId, Vec<(MemeId, MemeRecord)>>,
}

impl MemeFactoryData {
    fn get_mut() -> &'static mut Self {
        unsafe { DATA.as_mut().expect("MemeFactory::seed() should be called") }
    }
}

pub struct MemeFactory<ExecContext, EventTrigger> {
    exec_context: ExecContext,
    event_trigger: EventTrigger,
}

// TODO: macros should export items and dependencies by themselves
// TODO: #[gservice] and #[gprogram] are impossible to be used in the same scope
#[gservice]
impl<Context, Trigger> MemeFactory<Context, Trigger>
where
    Context: ExecContext,
    Trigger: EventTrigger<MemeFactoryEvent>,
{
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

    pub fn new(exec_context: Context, event_trigger: Trigger) -> Self {
        Self {
            exec_context,
            event_trigger,
        }
    }

    fn check_admin(&self, data: &MemeFactoryData, id: ActorId) -> Result<(), MemeError> {
        if data.admins.contains(&id) {
            Ok(())
        } else {
            Err(MemeError::Unauthorized)
        }
    }

    pub async fn create_fungible_program(
        &mut self,
        init_config: InitConfig,
    ) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();

        for meme_records in data.meme_coins.values() {
            for (_, meme_record) in meme_records {
                if meme_record.name == init_config.name {
                    return Err(MemeError::MemeExists);
                }
            }
        }

        // TODO: exec context do not emulate syscalls
        // TODO: so its usage is very limited
        let create_program_future =
            ProgramGenerator::create_program_with_gas_for_reply::<InitConfig>(
                data.meme_code_id,
                init_config.clone(),
                data.gas_for_program,
                0,
                0,
            )
            .map_err(|e| MemeError::ProgramInitializationFailedWithContext(e.to_string()))?;

        let (address, _) = create_program_future
            .await
            .map_err(|e| MemeError::ProgramInitializationFailedWithContext(e.to_string()))?;
        gstd::debug!("ABOBA3: {address:?}");

        data.meme_number = data.meme_number.saturating_add(1);

        data.id_to_address
            .entry(data.meme_number)
            .or_insert(address);

        let meme_record = MemeRecord {
            name: init_config.name.clone(),
            symbol: init_config.symbol.clone(),
            decimals: init_config.decimals,
            meme_program_id: address,
            admins: [init_config.admin].to_vec(),
        };

        data.meme_coins
            .entry((*self.exec_context.actor_id()).into())
            .or_default()
            .push((data.meme_number, meme_record));

        self.event_trigger
            .trigger(MemeFactoryEvent::MemeCreated {
                meme_id: data.meme_number,
                meme_address: address,
                init_config: Box::new(init_config),
            })
            .unwrap();

        Ok(())
    }

    pub fn update_gas_for_program(&mut self, new_gas_amount: u64) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();
        // TODO: sails-rtl define its own types so conversion is required
        // TODO: `msg::source()` just more convenient
        let source = (*self.exec_context.actor_id()).into();

        self.check_admin(data, source)?;

        data.gas_for_program = new_gas_amount;
        self.event_trigger
            .trigger(MemeFactoryEvent::GasUpdatedSuccessfully {
                updated_by: source,
                new_gas_amount,
            })
            .unwrap();
        Ok(())
    }

    pub fn update_code_id(&mut self, new_code_id: CodeId) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();
        let source = (*self.exec_context.actor_id()).into();

        self.check_admin(data, source)?;

        data.meme_code_id = new_code_id;
        self.event_trigger
            .trigger(MemeFactoryEvent::CodeIdUpdatedSuccessfully {
                updated_by: source,
                new_code_id,
            })
            .unwrap();
        Ok(())
    }

    pub fn add_admin_to_factory(&mut self, admin_actor_id: ActorId) -> Result<(), MemeError> {
        let data = MemeFactoryData::get_mut();
        // TODO: should be named `source_id`
        let source = (*self.exec_context.actor_id()).into();

        self.check_admin(data, source)?;

        data.admins.push(admin_actor_id);
        self.event_trigger
            .trigger(MemeFactoryEvent::AdminAdded {
                updated_by: source,
                admin_actor_id,
            })
            .unwrap();
        Ok(())
    }
}
