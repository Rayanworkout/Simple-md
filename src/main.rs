#[macro_use] extern crate rocket;

use rocket::fs::FileServer;
use rocket_dyn_templates::Template;
use serde_json::json;


#[get("/")]
fn index() -> Template {
    Template::render("index", json!({}))
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .attach(Template::fairing())
        .mount("/", FileServer::from("static"))
}