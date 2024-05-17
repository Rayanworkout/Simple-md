#[macro_use]
extern crate rocket;

use comrak::{markdown_to_html, ComrakOptions};
use rocket::fs::FileServer;
use rocket_dyn_templates::Template;
use serde::Deserialize;
use serde_json::json;
use rocket_contrib::json::Json;

#[derive(Deserialize)]
struct MarkdownInput {
    markdown: String,
}

#[get("/")]
fn index() -> Template {
    Template::render("index", json!({}))
}

#[post("/convert", format = "json", data = "<content>")]
fn text_to_md_html(content: Json<MarkdownInput>) -> String {
    let html_output = markdown_to_html(&content.markdown, &ComrakOptions::default());
    html_output
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index, text_to_md_html])
        .attach(Template::fairing())
        .mount("/", FileServer::from("static"))
}
