use erc20::services::admin::{ExternalLinks, Init};
use gstd::{prelude::*, ActorId};
use gtest::{Program, System};
use primitive_types::U256;

const USERS: &[u64] = &[3, 4, 5];

#[derive(Clone, Debug, PartialEq, Eq, Encode, Decode, TypeInfo)]
enum Role {
    Admin,
    Burner,
    Minter,
}

#[test]
fn test() {
    let sys = System::new();
    sys.init_logger();
    let ft = Program::from_file(
        &sys,
        "../target/wasm32-unknown-unknown/debug/erc20_wasm.opt.wasm",
    );

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
        admin_id: USERS[0].into(),
    };

    let encoded_request = ["New".encode(), init.encode()].concat();
    ft.send_bytes(USERS[0], encoded_request);

    let user: ActorId = USERS[0].into();
    let encoded_request = ["Erc20".encode(), "TotalSupply".encode(), (user).encode()].concat();
    let state = ft.send_bytes(USERS[0], encoded_request);
    let state = &state.decoded_log::<(String, String, U256)>();
    println!("\nstate {:?}", state);

    let user: ActorId = USERS[0].into();
    let value: U256 = 100.into();
    let encoded_request = ["Admin".encode(), "Burn".encode(), (user, value).encode()].concat();
    let res = ft.send_bytes(USERS[1], encoded_request);

    let user: ActorId = USERS[0].into();
    let encoded_request = ["Erc20".encode(), "TotalSupply".encode(), (user).encode()].concat();
    let state = ft.send_bytes(USERS[0], encoded_request);
    let state = &state.decoded_log::<(String, String, U256)>();
    println!("\nstate {:?}", state);

    let user: ActorId = USERS[1].into();
    let role = Role::Minter;
    let encoded_request = [
        "Admin".encode(),
        "GrantRole".encode(),
        (user, role).encode(),
    ]
    .concat();
    let res = ft.send_bytes(USERS[0], encoded_request);

    let user: ActorId = USERS[0].into();
    let value: U256 = 100.into();
    let encoded_request = ["Admin".encode(), "Burn".encode(), (user, value).encode()].concat();
    let res = ft.send_bytes(USERS[1], encoded_request);

    let user: ActorId = USERS[0].into();
    let encoded_request = ["Erc20".encode(), "TotalSupply".encode(), (user).encode()].concat();
    let state = ft.send_bytes(USERS[0], encoded_request);
    let state = &state.decoded_log::<(String, String, U256)>();
    println!("\nstate {:?}", state);
}
