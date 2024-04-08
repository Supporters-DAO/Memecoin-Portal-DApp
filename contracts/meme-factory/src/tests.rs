use io::*;
use gstd::{Encode, String};
use gtest::{Program, System};
const USERS: &[u64] = &[3, 4, 5];

#[test]
fn create_meme() {
    let sys = System::new();
    sys.init_logger();
    let factory = Program::current(&sys);

    let init_config = InitConfig {
        name: "MemeName".to_string(),
        symbol: "MEME".to_string(),
        decimals: 2,
        description: "Description".to_string(),
        external_links: ExternalLinks {
            website: Some("http://".to_string()),
            telegram: Some("http://telegram.me/".to_string()),
            twitter: Some("http://twitter.com/".to_string()),
            discord: Some("http://discord.gg/".to_string()),
        },
        initial_supply: 1000,
        admin: ActorId::new([0; 32]),
        initial_capacity: Some(100), 
        config: Config {
            tx_storage_period: 30, 
            tx_payment: 100_000,
        },
    };

    let res = factory.send(
        USERS[0],
        MemeFactoryAction::CreateMeme { init_config: init_config.clone() },
    );

    assert!(res.contains(&(
        USERS[0],
        MemeFactoryEvent::MemeCreated {
            meme_id: 1.into(), 
            meme_address: ActorId::new([0; 32]), 
            init_config: init_config,
        }
        .encode()
    )));
}


#[test]
fn code_id_update() {
    let sys = System::new();
    sys.init_logger();
    let factory = Program::current(&sys);

    let new_code_id = CodeId::new([1; 32]);  

    let res = factory.send(
        USERS[0],
        MemeFactoryAction::CodeIdUpdate { new_code_id: new_code_id.clone() },
    );

    assert!(res.contains(&(
        USERS[0],
        MemeFactoryEvent::CodeIdUpdatedSuccessfully {
            updated_by: USERS[0].into(),
            new_code_id: new_code_id,
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

    let res = factory.send(
        USERS[0],
        MemeFactoryAction::UpdateGasProgram(new_gas_amount),
    );

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

    let res = factory.send(
        USERS[0],
        MemeFactoryAction::AddAdmin { admin_actor_id: admin_actor_id.clone() },
    );

    assert!(res.contains(&(
        USERS[0],
        MemeFactoryEvent::AdminAdded {
            updated_by: USERS[0].into(),
            admin_actor_id,
        }
        .encode()
    )));
}

