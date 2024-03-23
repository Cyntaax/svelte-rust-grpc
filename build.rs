fn main() {
    tonic_build::configure().out_dir("src/").build_client(false).compile(&["proto/rpc.proto"], &["proto"]/* includes */).unwrap()
}
