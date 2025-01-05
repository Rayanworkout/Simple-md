#[macro_use]
extern crate rocket;

mod routes;
use std::{fs, vec};
use rocket::fs::FileServer;
use rocket_dyn_templates::Template;
use serde_json::json;

#[get("/")]
fn index() -> Template {
    Template::render("index", json!({}))
}

#[launch]
fn rocket() -> _ {
    
    // Creating the folder that will store the markdown files
    match fs::create_dir_all("docs") {
        Ok(_) => println!("Directory created"),
        Err(err) => panic!("Error creating docs/ directory: {}", err),
    }
    
    rocket::build()
        .mount("/", routes![index, routes::markdown::convert_md_to_html, routes::markdown::save_markdown])
        .attach(Template::fairing())
        .mount("/", FileServer::from("static"))
}
