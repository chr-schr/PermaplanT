use dotenvy::dotenv;

pub mod config;
pub mod constants;
pub mod controllers;
pub mod error;
pub mod models;
pub mod schema;
pub mod server;
pub mod services;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    match config::app::Config::from_env() {
        Ok(config) => server::start(config).await,
        Err(e) => {
            eprintln!("Error reading configuration: {}", e);
            std::process::exit(1);
        }
    }
}