use app::Program;
use sails_idl_gen::program;
use std::{env, fs::File, path::PathBuf};

fn main() {
    gear_wasm_builder::build();

    let manifest_dir_path = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let idl_file_path = manifest_dir_path.join("meme-factory.idl");
    let idl_file = File::create(&idl_file_path).unwrap();
    program::generate_idl::<Program>(idl_file).unwrap();

    let out_dir_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    let out_path = out_dir_path.join("client.rs");
    sails_client_gen::generate_client_from_idl(idl_file_path, out_path).unwrap();
}