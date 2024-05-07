#![no_std]
// TODO: remove lint when issue is resolved
// TODO: https://github.com/gear-tech/sails/issues/183
#![allow(dead_code)]

extern crate alloc;

pub mod service;

pub use service::{
    InitConfigFactory, MemeError, MemeFactoryData, MemeFactoryEvent, MemeId, MemeRecord,
};

use sails_macros::gprogram;
use sails_rtl::gstd::{events::GStdEventTrigger, GStdExecContext};

type MemeFactory = service::MemeFactory<GStdExecContext, GStdEventTrigger<MemeFactoryEvent>>;

pub struct Program;

#[gprogram]
impl Program {
    pub fn new(config: InitConfigFactory) -> Self {
        MemeFactory::seed(config);
        Self
    }

    // Expose hosted service
    pub fn meme_factory(&self) -> MemeFactory {
        MemeFactory::new(GStdExecContext::new(), GStdEventTrigger::new())
    }
}
