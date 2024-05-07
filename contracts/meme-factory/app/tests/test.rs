use app::{
    service::{ExternalLinks, Init},
    InitConfigFactory, MemeFactoryEvent,
};
use gstd::{ActorId, CodeId, Encode, MessageId, TypeInfo};
use gtest::{Log, Program, System};
use parity_scale_codec::Decode;

const USER1: u64 = 3;

#[derive(Clone, Debug, PartialEq, Eq, Encode, Decode, TypeInfo)]
struct Test {
    updated_by: ActorId,
    new_code_id: MessageId,
}

fn init_factory(sys: &System) -> Program {
    let factory = Program::from_file(
        sys,
        "../target/wasm32-unknown-unknown/debug/factory_wasm.opt.wasm",
    );
    let fungible_code_id = sys.submit_code(
        "../../fungible-token/target/wasm32-unknown-unknown/debug/erc20_wasm.opt.wasm",
    );

    let init_config_factory = InitConfigFactory {
        meme_code_id: CodeId::from(fungible_code_id.into_bytes()),
        factory_admin_account: vec![USER1.into()],
        gas_for_program: 10_000_000_000,
    };
    let request = ["New".encode(), init_config_factory.encode()].concat();
    println!("{:?}", request);
    let res = factory.send_bytes(USER1, request);
    assert!(!res.main_failed());

    factory
}

#[test]
fn create_meme() {
    let sys = System::new();
    sys.init_logger();

    let factory = init_factory(&sys);

    let init = Init {
        name: "MemeName".to_string(),
        symbol: "MEME".to_string(),
        decimals: 2,
        description: "Description".to_string(),
        external_links: ExternalLinks {
            image: "https://img.com/".to_string(),
            website: Some("http://example.org/".to_string()),
            telegram: Some("http://telegram.me/".to_string()),
            twitter: Some("http://twitter.com/".to_string()),
            discord: Some("http://discord.gg/".to_string()),
            tokenomics: Some("http://tokenomics.gg/".to_string()),
        },
        initial_supply: 1000.into(),
        max_supply: 10_000_000.into(),
        admin_id: ActorId::new([0; 32]),
    };
    let request = [
        "MemeFactory".encode(),
        "CreateFungibleProgram".encode(),
        init.encode(),
    ]
    .concat();
    let res = factory.send_bytes(USER1, request);
    assert!(!res.main_failed());

    let log = &res.log()[0];
    assert_eq!(log.destination(), 0.into());

    // 0 is discriminant of `MemeCreated` variant
    let event = [
        &[0],
        &log.payload()["MemeFactory".encode().len() + "MemeCreated".encode().len()..],
    ]
    .concat();
    let mut event: MemeFactoryEvent = Decode::decode(&mut &event[..]).unwrap();

    // TODO: compare with latest program id when `gtest` is updated
    if let MemeFactoryEvent::MemeCreated { meme_address, .. } = &mut event {
        *meme_address = ActorId::new([0xfe; 32]);
    }

    assert_eq!(
        event,
        MemeFactoryEvent::MemeCreated {
            meme_id: 1,
            meme_address: ActorId::new([0xfe; 32]),
            init: init.clone(),
        }
    );
}

#[test]
fn code_id_update() {
    let sys = System::new();
    sys.init_logger();

    let factory = init_factory(&sys);

    let new_code_id = CodeId::new([1; 32]);
    let request = [
        "MemeFactory".encode(),
        "UpdateCodeId".encode(),
        new_code_id.encode(),
    ]
    .concat();
    let res = factory.send_bytes(USER1, request);

    let payload = [
        &"MemeFactory".encode(),
        &"CodeIdUpdatedSuccessfully".encode(),
        &MemeFactoryEvent::CodeIdUpdatedSuccessfully {
            updated_by: USER1.into(),
            new_code_id,
        }
        .encode()[1..],
    ]
    .concat();
    assert!(res.contains(&Log::builder().dest(0).payload_bytes(payload)));
}

#[test]
fn update_gas_program() {
    let sys = System::new();
    sys.init_logger();

    let factory = init_factory(&sys);

    let new_gas_amount = 50000u64;
    let request = [
        "MemeFactory".encode(),
        "UpdateGasForProgram".encode(),
        new_gas_amount.encode(),
    ]
    .concat();
    let res = factory.send_bytes(USER1, request);

    let payload = [
        &"MemeFactory".encode(),
        &"GasUpdatedSuccessfully".encode(),
        &MemeFactoryEvent::GasUpdatedSuccessfully {
            updated_by: USER1.into(),
            new_gas_amount,
        }
        .encode()[1..],
    ]
    .concat();
    assert!(res.contains(&Log::builder().dest(0).payload_bytes(payload)));
}

#[test]
fn add_admin() {
    let sys = System::new();
    sys.init_logger();

    let factory = init_factory(&sys);

    let admin_actor_id = ActorId::new([2; 32]);
    let request = [
        "MemeFactory".encode(),
        "AddAdminToFactory".encode(),
        admin_actor_id.encode(),
    ]
    .concat();
    let res = factory.send_bytes(USER1, request);

    let payload = [
        &"MemeFactory".encode(),
        &"AdminAdded".encode(),
        &MemeFactoryEvent::AdminAdded {
            updated_by: USER1.into(),
            admin_actor_id,
        }
        .encode()[1..],
    ]
    .concat();
    assert!(res.contains(&Log::builder().dest(0).payload_bytes(payload)));
}
