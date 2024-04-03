use gstd::ActorId;
use gtest::{Log, Program, System, TestError};
use io::*;

pub const NAME: String = 15;
pub const SYMBOL: String = 16;
pub const DECIMALS: u8 = 15_000_000_000_000;
pub const ONE_VARA: u128 = 1_000_000_000_000;

pub const MEME_ADDRESS: ActorId = ActorId::new([
    240, 35, 217, 33, 79, 57, 144, 77, 203, 216, 17, 51, 38, 135, 252, 73, 206, 23, 79, 12, 248,
    73, 207, 171, 26, 91, 216, 6, 202, 243, 156, 250,
]);

#[test]
fn init_meme_factory() {
    let system = System::new();
    let meme_code_id =
        system.submit_code("../target/wasm32-unknown-unknown/release/fungible_token.opt.wasm");
    let meme_factory = Program::current(&system);
    let res = meme_factory.send(100, meme_code_id);
    assert!(!res.main_failed());
}

#[test]
fn create_new_memecoin() {
    let system = System::new();
    let meme_code_id =
        system.submit_code("../target/wasm32-unknown-unknown/release/fungible_token.opt.wasm");
    let meme_factory = Program::current(&system);
    let res = meme_factory.send(100, meme_code_id);
    assert!(!res.main_failed());

    let payload = InitConfig {
        name: NAME,
        symbol: SYMBOL,
        decimals: DECIMALS,
    };

    let res = meme_factory.send(BUYER, payload);

    let log = Log::builder().dest(BUYER).payload(MemeCreated {
        meme_id: 1u64.into(),
        meme_address: MEME_ADDRESS,
    });

    assert!(!res.main_failed());
    assert!(res.contains(&log));
}
