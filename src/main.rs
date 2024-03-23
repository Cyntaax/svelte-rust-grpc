#[macro_use] extern crate rocket;

use tonic::{Request, Response, Status};
use rpc::main_server::{Main, MainServer};
use rpc::Normal;
use rpc::Blank;

#[derive(Default)]
pub struct MyMain {}

#[tonic::async_trait]
impl Main for MyMain {
    async fn test(&self, request: Request<Normal>) -> Result<Response<Blank>, Status> {
        println!("Got a request: {:?}", request.into_inner().id);
        let response = Blank {
            blank: false,
        };
        Ok(Response::new(response))
    }
}


mod web;
mod rpc;


#[get("/")]
async fn index() -> &'static str {
    "Hello, world!"
}

#[tokio::main]
async fn main() {
    tokio::task::spawn(async {
        web::generate_js_proto().await;
        web::start_dev_server().await;
    });
    println!("executing");

    let addr = "127.0.0.1:5174".parse().unwrap();
    let r#main = MyMain::default();
    let r#main = MainServer::new(r#main);

    tonic::transport::Server::builder().accept_http1(true).add_service(tonic_web::enable(r#main)).serve(addr).await.unwrap();
}

