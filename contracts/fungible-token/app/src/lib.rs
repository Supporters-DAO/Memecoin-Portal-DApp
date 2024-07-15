#![no_std]
#![allow(clippy::new_without_default)]

use sails::gstd::gprogram;
mod services;
use services::extended_vft::utils::Init;
use services::extended_vft::ExtendedVft;
pub struct Program(());

#[gprogram]
impl Program {
    pub fn new(init: Init) -> Self {
        ExtendedVft::seed(init);
        Self(())
    }

    pub fn vft(&self) -> ExtendedVft {
        ExtendedVft::new()
    }
}
