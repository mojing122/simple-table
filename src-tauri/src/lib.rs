pub mod modules;
use crate::modules::table_data;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> Result<String, String> {
    Ok(format!("Hello, {}! You've been greeted from Rust!", name))
}

#[tauri::command]
fn read_table_data(path: &str) -> Result<String, String> {
    match table_data::table_data::convert_excel_to_table_data(path, "") {
        Ok(data) => Ok(data),
        Err(e) => Err(format!("Failed to read table data: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, read_table_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
