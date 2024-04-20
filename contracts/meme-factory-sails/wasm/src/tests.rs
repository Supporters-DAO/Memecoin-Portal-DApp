extern crate std;

use alloc::{boxed::Box, string::ToString, vec};
use gstd::{ActorId, CodeId, Encode};
use gtest::{Log, Program, System};
use io::{Config, ExternalLinks, InitConfig, InitConfigFactory, MemeFactoryEvent};

const USERS: &[u64] = &[3, 4, 5];

#[test]
fn create_meme() {
    let sys = System::new();
    sys.init_logger();
    let factory = Program::current(&sys);

    let fungible_code_id =
        sys.submit_code("../target/wasm32-unknown-unknown/debug/fungible_token.opt.wasm");

    let init_config_factory = InitConfigFactory {
        meme_code_id: CodeId::from(fungible_code_id.into_bytes()),
        factory_admin_account: vec![USERS[0].into()],
        gas_for_program: 1_000_000_000,
    };
    let request = ["New".encode(), init_config_factory.encode()].concat();
    let res = factory.send_bytes(USERS[0], request);
    assert!(!res.main_failed());

    let init_config = InitConfig {
        name: "MemeName".to_string(),
        symbol: "MEME".to_string(),
        decimals: 2,
        description: "Description".to_string(),
        external_links: ExternalLinks {
            image: Some("https://imgur.com/".to_string()),
            website: Some("http://example.org/".to_string()),
            telegram: Some("http://telegram.me/".to_string()),
            twitter: Some("http://twitter.com/".to_string()),
            discord: Some("http://discord.gg/".to_string()),
        },
        initial_supply: 1000,
        total_supply: 10_000_000,
        admin: ActorId::new([0; 32]),
        initial_capacity: Some(100),
        config: Config {
            tx_storage_period: 30,
            tx_payment: 100_000,
        },
    };
    let request = ["CreateFungibleProgram".encode(), init_config.encode()].concat();
    let res = factory.send_bytes(USERS[0], request);

    let payload = [
        &"MemeCreated".encode(),
        &MemeFactoryEvent::MemeCreated {
            meme_id: 1,
            meme_address: ActorId::from([
                106, 171, 49, 42, 252, 31, 189, 241, 199, 8, 161, 126, 13, 94, 6, 137, 154, 161,
                68, 242, 62, 163, 198, 132, 106, 90, 59, 148, 238, 180, 98, 87,
            ]),
            init_config: Box::new(init_config.clone()),
        }
        .encode()[1..],
    ]
    .concat();
    let log = Log::builder().source(1).dest(0).payload_bytes(payload);
    assert!(res.contains(&log));
}

#[test]
fn code_id_update() {
    let sys = System::new();
    sys.init_logger();
    let factory = Program::current(&sys);

    let new_code_id = CodeId::new([1; 32]);
    let request = ["UpdateCodeId".encode(), new_code_id.encode()].concat();
    let res = factory.send_bytes(USERS[0], request);
    assert!(res.contains(&(
        USERS[0],
        MemeFactoryEvent::CodeIdUpdatedSuccessfully {
            updated_by: USERS[0].into(),
            new_code_id,
        }
        .encode()
    )));
}

#[test]
fn update_gas_program() {
    let sys = System::new();
    sys.init_logger();
    let factory = Program::current(&sys);

    let new_gas_amount = 50000u64;
    let request = ["UpdateGasForProgram".encode(), new_gas_amount.encode()].concat();
    let res = factory.send_bytes(USERS[0], request);
    assert!(res.contains(&(
        USERS[0],
        MemeFactoryEvent::GasUpdatedSuccessfully {
            updated_by: USERS[0].into(),
            new_gas_amount,
        }
        .encode()
    )));
}

#[test]
fn add_admin() {
    let sys = System::new();
    sys.init_logger();
    let factory = Program::current(&sys);

    let admin_actor_id = ActorId::new([2; 32]);
    let request = ["AddAdminToFactory".encode(), admin_actor_id.encode()].concat();
    let res = factory.send_bytes(USERS[0], request);
    assert!(res.contains(&(
        USERS[0],
        MemeFactoryEvent::AdminAdded {
            updated_by: USERS[0].into(),
            admin_actor_id,
        }
        .encode()
    )));
}
