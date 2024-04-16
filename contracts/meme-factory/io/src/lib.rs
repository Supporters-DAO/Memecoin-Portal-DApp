#![no_std]

use gmeta::{In, InOut, Metadata};
use gstd::{prelude::*, ActorId, CodeId};

pub type MemeId = u64;

#[derive(Encode, Decode, TypeInfo, Debug)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum MemeFactoryAction {
    CreateMeme { init_config: InitConfig },
    CodeIdUpdate { new_code_id: CodeId },
    UpdateGasProgram(u64),
    AddAdmin { admin_actor_id: ActorId },
    RemoveMeme { meme_id: MemeId },
}

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

#[derive(Encode, Decode, TypeInfo, Debug)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum MemeFactoryEvent {
    MemeCreated {
        meme_id: MemeId,
        meme_address: ActorId,
        init_config: InitConfig,
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
    MemeRemoved {
        removed_by: ActorId,
        meme_id: MemeId,
    },
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
    MemeIdNotFoundInAddress,
    MemeIdNotFoundInMemeCoins,
}

#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum FTAction {
    Mint { amount: u128, to: ActorId },
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
    AdminAdded,
}

#[derive(Debug, Decode, Encode, TypeInfo, Clone)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitConfig {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub description: String,
    pub external_links: ExternalLinks,
    pub initial_supply: u128,
    pub total_supply: u128,
    pub admin: ActorId,
    pub initial_capacity: Option<u32>,
    pub config: Config,
}

#[derive(Debug, Decode, Encode, TypeInfo, Default, Clone)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct Config {
    pub tx_storage_period: u64,
    pub tx_payment: u128,
}

#[derive(Debug, Decode, Encode, TypeInfo, Default, Clone)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct ExternalLinks {
    pub image: String,
    pub website: Option<String>,
    pub telegram: Option<String>,
    pub twitter: Option<String>,
    pub discord: Option<String>,
}

#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitConfigFactory {
    pub meme_code_id: CodeId,
    pub factory_admin_account: Vec<ActorId>,
    pub gas_for_program: u64,
}

pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    type Init = In<InitConfigFactory>;
    type Handle = InOut<MemeFactoryAction, Result<MemeFactoryEvent, MemeError>>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = InOut<Query, QueryReply>;
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
