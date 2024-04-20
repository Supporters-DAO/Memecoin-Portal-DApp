#![no_std]

extern crate alloc;

#[cfg(target_arch = "wasm32")]
pub use app::wasm::*;

#[cfg(test)]
mod tests;
