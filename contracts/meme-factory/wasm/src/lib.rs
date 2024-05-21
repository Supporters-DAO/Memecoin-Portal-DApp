#![no_std]

extern crate alloc;

#[cfg(target_arch = "wasm32")]
pub use app::wasm::*;

use alloc::vec::Vec;
use app::{MemeFactoryData, MemeId, MemeRecord};
use gstd::{msg, ActorId, CodeId, Decode, Encode, TypeInfo};

#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum Query {
    MemeNumber,
    MemeCodeId,
    FactoryAdminAccount,
    GasForProgram,
    IdToAddress,
    MemeCoins,
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
    MemeCoins(Vec<(ActorId, Vec<(MemeId, MemeRecord)>)>),
}

// `sails` doesn't support `state` entrypoint generation
#[no_mangle]
extern "C" fn state() {
    let data = MemeFactoryData::get_mut();
    let query: Query = msg::load().expect("Unable to decode the query");
    let reply = match query {
        Query::MemeNumber => QueryReply::MemeNumber(data.meme_number),
        Query::MemeCodeId => QueryReply::MemeCodeId(data.meme_code_id),
        Query::FactoryAdminAccount => QueryReply::FactoryAdminAccount(data.admins.clone()),
        Query::GasForProgram => QueryReply::GasForProgram(data.gas_for_program),
        Query::IdToAddress => QueryReply::IdToAddress(
            data.id_to_address
                .iter()
                .map(|(&meme_id, &actor_id)| (meme_id, actor_id))
                .collect(),
        ),
        Query::MemeCoins => QueryReply::MemeCoins(
            data.meme_coins
                .iter()
                .map(|(&actor_id, records)| (actor_id, records.clone()))
                .collect(),
        ),
    };
    msg::reply(reply, 0).expect("Error on state");
}
