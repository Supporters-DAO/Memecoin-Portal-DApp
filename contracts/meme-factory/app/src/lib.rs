#![no_std]
// TODO: remove lint when issue is resolved
// TODO: https://github.com/gear-tech/sails/issues/183
#![allow(dead_code)]

extern crate alloc;

pub mod service;

pub use service::{
    InitConfigFactory, MemeError, MemeFactoryData, MemeFactoryEvent, MemeId, MemeRecord,
};

use sails_rs::gstd::program;

pub struct Program;

#[program]
impl Program {
    pub fn new(config: InitConfigFactory) -> Self {
        service::MemeFactory::seed(config);
        Self
    }

    // Expose hosted service
    pub fn meme_factory(&self) -> service::MemeFactory {
        service::MemeFactory::new()
    }
}
