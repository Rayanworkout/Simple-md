use rocket::{http::RawStr, serde::{json::Json, Deserialize}};
use std::fs;

#[derive(Debug, Deserialize)]
pub struct MarkdownContent {
    filename: String,
    content: String,
}

#[post("/save-markdown", format = "json", data = "<markdown>")]
pub async fn save_markdown(markdown: Json<MarkdownContent>) -> &'static str {
    println!("Saving file: {}", markdown.filename);
    let file_path = format!("docs/{}", markdown.filename);

    // Save the content to a file
    match fs::write(file_path, &markdown.content) {
        Ok(_) => "File saved successfully",
        Err(err) => {
            eprintln!("Error saving file: {}", err);
            "Error saving file"
        }
    }
}


#[post(
    "/convert/<cell_type>/<id>",
    format = "application/x-www-form-urlencoded",
    data = "<data>"
)]
pub fn convert_md_to_html(data: &str, cell_type: &str, id: u32) -> String {
    let content = data.split("markdown-content=").collect::<Vec<&str>>()[1];
    let raw_str: &RawStr = content.into();

    let decoded_data = raw_str.url_decode().unwrap();
    let html = comrak::markdown_to_html(&decoded_data, &comrak::ComrakOptions::default());

    let full_cell: String;

    if cell_type.to_lowercase() == String::from("new") {
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
