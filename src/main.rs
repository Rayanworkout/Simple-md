#[macro_use]
extern crate rocket;
use rocket_dyn_templates::Template;
use serde_json::json;

#[get("/")]
fn index() -> Template {
    let context = json!({});
    Template::render("index", &context)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .attach(Template::fairing())
}
