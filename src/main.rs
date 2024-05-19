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
    "/convert/<ctype>/<id>",
    format = "application/x-www-form-urlencoded",
    data = "<data>"
)]
fn convert_md_to_html(data: &str, ctype: &str, id: u32) -> String {
    let content = data.split("markdown-content=").collect::<Vec<&str>>()[1];
    let raw_str: &RawStr = content.into();

    let decoded_data = raw_str.url_decode().unwrap();
    let html = comrak::markdown_to_html(&decoded_data, &comrak::ComrakOptions::default());

    let full_cell: String;

    if ctype.to_lowercase() == String::from("new") {
        full_cell = format!(
            "<div>
                
                <div class=\"panel-container\">
                    <i class=\"bi bi-pencil-square edit md-html\" onclick=\"editCell(this.id)\" id=\"cell-{id}\"></i>
                    <i class=\"bi bi-x-circle delete md-html\" onclick=\"deleteCell(this.id)\" id=\"cell-{id}\"></i>
                </div>
                
                <div class=\"cell md-html\" id=\"cell-{id}\">{html}</div>
            
            </div>"
        )
    } else {
        full_cell = format!(
            "<div>
                <div class=\"cell md-html\" id=\"cell-{id}\">{html}</div>
            </div>"
        )
    }

    full_cell
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index, convert_md_to_html])
        .attach(Template::fairing())
        .mount("/", FileServer::from("static"))
}
