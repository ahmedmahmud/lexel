// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf};
use tauri::Manager;
use walkdir::WalkDir;
use window_vibrancy::{apply_mica, apply_vibrancy, NSVisualEffectMaterial};

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[derive(Clone, serde::Serialize)]
struct File {
    name: String,
    path: String,
}

fn get_directory() -> PathBuf {
    let mut docs = dirs::document_dir().unwrap();
    docs.push("lexel");
    docs
}

fn create_dir() {
    let directory = get_directory();
    fs::create_dir_all(directory).unwrap();
}

#[tauri::command]
fn get_files() -> Vec<File> {
    println!("WOWOWOWOW222");
    let directory = get_directory();
    WalkDir::new(directory)
        .min_depth(1)
        .into_iter()
        .filter_map(|e| {
            let e = e.ok()?;
            let name = e.file_name().to_str()?.to_string();
            let path = e.path().to_str()?.to_string();
            Some(File { name, path })
        })
        .collect::<Vec<File>>()
}

#[tauri::command]
fn get_file(path: String) -> String {
    println!("WOWOWOWOW");
    let pt = PathBuf::from(path);
    dbg!(&pt);
    let file = fs::read_to_string(pt).expect("path doesnt exist");
    dbg!(&file);
    file
}

#[tauri::command]
fn save_file(path: String, data: String) {
    let pt = PathBuf::from(path);
    fs::write(pt, data).expect("Unable to write file");
}

#[tauri::command]
fn read_image(path: String) -> Vec<u8> {
    let mut base = get_directory();
    base.push(path);
    dbg!(&base);
    let file = fs::read(base).expect("path doesnt exist");
    // dbg!(&file);
    // file
    // "wow".to_string()
    file
}

fn main() {
    create_dir();

    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_mica(&window, Some(true))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            // window.minimize().unwrap();
            // window.unminimize().unwrap();

            // window.maximize().unwrap();
            // window.unmaximize().unwrap();

            window.set_decorations(true).unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_file, get_files, save_file, read_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
