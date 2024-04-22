#![no_std]

extern crate alloc;

mod service;

pub use service::{
    Config, ExternalLinks, InitConfig, InitConfigFactory, MemeError, MemeFactoryEvent, MemeId,
    MemeRecord,
};

use sails_macros::{gprogram, groute};
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
    // TODO: simple #[groute] in case of empty route string
    #[groute("")]
    pub fn meme_factory(&self) -> MemeFactory {
        MemeFactory::new(GStdExecContext::new(), GStdEventTrigger::new())
    }
}
