#[macro_use]
extern crate rocket;

use rocket::fs::FileServer;
use rocket::http::RawStr;
use rocket_dyn_templates::Template;
use serde_json::json;

#[allow(unused_imports)]
use rocket::serde::{json::Json, Deserialize};

// #[derive(Deserialize)]
// #[serde(crate = "rocket::serde")]
// struct Markdown {
//     markdown: String,
// }

#[get("/")]
fn index() -> Template {
    Template::render("index", json!({}))
}

// Endpoint if we were using vanilla JS fetch
// #[post("/convert", format = "application/json", data = "<data>")]
// fn convert_md_to_html(data: Json<Markdown>) -> String {
//     let html = comrak::markdown_to_html(&data.markdown, &comrak::ComrakOptions::default());
//     html
// }

#[post(
    "/convert",
    format = "application/x-www-form-urlencoded",
    data = "<data>"
)]
fn convert_md_to_html(data: String) -> String {
    let content = data.split("=").collect::<Vec<&str>>()[1];
    let raw_str: &RawStr = content.into();

    let decoded_data = raw_str.url_decode().unwrap();
    let html = comrak::markdown_to_html(&decoded_data, &comrak::ComrakOptions::default());

    format!("<div class=\"cell\">{html}</div>")
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index, convert_md_to_html])
        .attach(Template::fairing())
        .mount("/", FileServer::from("static"))
}
