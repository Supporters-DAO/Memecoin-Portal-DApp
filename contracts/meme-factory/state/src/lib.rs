
#![no_std]

use io::*;
use gmeta::{ Metadata, metawasm};
use gstd::{ ActorId, prelude::*};


#[cfg(feature = "binary-vendor")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

#[metawasm]
pub mod metafns {
    pub type State = <ContractMetadata as Metadata>::State;

    pub fn state(state: State) -> IoMemeFactory {
        state
    }

    pub fn get_allmemecoins(state: State) -> Vec<(MemeId,MemeRecord)> {
        state.all_memecoins
    }

    pub fn get_id_to_address(state: State) -> Vec<(MemeId, ActorId)> {
        state.id_to_address
    }

    pub fn get_memecoins_for_actor_id(state: State) -> Vec<(ActorId, Vec<(MemeId,MemeRecord)>)> {
        state.memecoins
    }



}