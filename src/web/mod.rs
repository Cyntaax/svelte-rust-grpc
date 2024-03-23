use std::process::{Command, CommandArgs};
use std::os::windows::process::CommandExt;
use tokio::fs::File;
use tokio::io::AsyncReadExt;


pub async fn start_dev_server() {
    // start npm server with `npm run dev`
    let output = Command::new("npm.cmd").args(&["run", "dev", "&"]).current_dir("./web").output().unwrap();

    println!("Started dev server!");
}

pub async fn generate_js_proto() {
    let output = Command::new("protoc").args(&["--plugin=protoc-gen-ts_proto.cmd", "--ts_proto_out=./web/src/lib", "--ts_proto_opt=importSuffix=.js", "--ts_proto_opt=env=browser","--ts_proto_opt=outputClientImpl=grpc-web","--proto_path", "./proto", "proto/rpc.proto"]).current_dir("./").output().unwrap();

    let mut output_file = File::open("./web/src/lib/rpc.ts").await.unwrap();

    let mut buf = String::new();
    let output_file = output_file.read_to_string(&mut buf).await.unwrap();

    let new_buf = buf.replace("import { grpc } from \"@improbable-eng/grpc-web\";","import * as grpcweb from '@improbable-eng/grpc-web';\nconst grpc = grpcweb.grpc;");

    tokio::fs::write("./web/src/lib/rpc.ts", new_buf).await.unwrap();
    let stringier = std::str::from_utf8(&output.stderr).unwrap();
    let stringer2 = std::str::from_utf8(&output.stdout).unwrap();
    println!("{:?}\n{}", stringier, stringer2);
}
