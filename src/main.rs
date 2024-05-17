#[macro_use]
extern crate rocket;

use rocket::fs::FileServer;
use rocket_dyn_templates::Template;
use serde_json::json;
use rocket::serde::{Deserialize, json::Json};


#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct Markdown {
    markdown: String,
}

#[get("/")]
fn index() -> Template {
    Template::render("index", json!({}))
}

#[post("/convert", format = "application/json", data = "<data>")]
fn convert_md_to_html(data: Json<Markdown>) -> String {
    let html = comrak::markdown_to_html(&data.markdown, &comrak::ComrakOptions::default());
    html
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index, convert_md_to_html])
        .attach(Template::fairing())
        .mount("/", FileServer::from("static"))
}
