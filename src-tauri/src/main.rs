// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};
use std::{fs, path::PathBuf};
use tauri::{App, Manager};
use walkdir::WalkDir;

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
            Some(File {
                name,
                path
            })
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

fn do_something(app: &App) {
    app.emit_all(
        "fs",
        Payload {
            message: "Tauri is awesome!".into(),
        },
    )
    .unwrap();
}

fn watch(app: &App) {
    let directory = get_directory();
    let (tx, rx) = std::sync::mpsc::channel();

    let mut watcher = RecommendedWatcher::new(tx, Config::default()).unwrap();

    watcher
        .watch(directory.as_ref(), RecursiveMode::Recursive)
        .unwrap();

    for res in rx {
        match res {
            Ok(event) => {
                println!("change");
                dbg!(event);
                do_something(app);
            }
            Err(error) => println!("Error: {error:?}"),
        }
    }
}

fn main() {
    // create_dir();

    tauri::Builder::default()
        // .setup(|app| Ok(()))
        .invoke_handler(tauri::generate_handler![get_file, get_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
