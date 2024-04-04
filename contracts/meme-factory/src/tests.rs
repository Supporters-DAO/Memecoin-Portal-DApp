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
        name: "MemeName".into(),
        symbol: "MemeName".into(),
        decimals: 2.into(),
        description: "Description".into(),
        external_links: "MemeName".into(),
        initial_supply: "MemeName".into(),
        admin: "MemeName".into(),
        initial_capacity: "MemeName".into(),
        config: "MemeName".into(),
        
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

