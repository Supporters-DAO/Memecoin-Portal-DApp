use app::{
    service::{ExternalLinks, Init},
    InitConfigFactory,
};
use gclient::{EventProcessor, GearApi, Result};
use gstd::{ActorId, Encode};

#[tokio::test]
async fn gclient_create_meme() -> Result<()> {
    let api = GearApi::dev_from_path("../target/tmp/gear").await?;
    // let api = GearApi::dev().await?;
    let mut listener = api.subscribe().await?; // Subscribing for events.
                                               // Checking that blocks still running.
    assert!(listener.blocks_running().await?);

    let (ft_code_id, _) = api
        .upload_code_by_path(
            "../../fungible-token/target/wasm32-unknown-unknown/debug/erc20_wasm.opt.wasm",
        )
        .await
        .expect("Error upload code");

    let ft_code_id: [u8; 32] = ft_code_id.into();

    let init_config_factory = InitConfigFactory {
        meme_code_id: ft_code_id.into(),
        factory_admin_account: vec![1.into()],
        gas_for_program: 20_000_000_000,
    };

    let request = ["New".encode(), init_config_factory.encode()].concat();

    let path = "../target/wasm32-unknown-unknown/debug/factory_wasm.opt.wasm";

    let gas_info = api
        .calculate_upload_gas(None, gclient::code_from_os(path)?, request.clone(), 0, true)
        .await?;

    let (message_id, program_id, _hash) = api
        .upload_program_bytes(
            gclient::code_from_os(path)?,
            gclient::now_micros().to_le_bytes(),
            request,
            gas_info.min_limit,
            0,
        )
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());

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
        "CreateFungibleProgram".to_string().encode(),
        init.encode(),
    ]
    .concat();

    let gas_info = api
        .calculate_handle_gas(None, program_id, request.clone(), 0, true)
        .await?;

    let (message_id, _) = api
        .send_message_bytes(program_id, request.clone(), gas_info.min_limit, 0)
        .await?;

    assert!(listener.message_processed(message_id).await?.succeed());
    assert!(listener.blocks_running().await?);

    Ok(())
}
