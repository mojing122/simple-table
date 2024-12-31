# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Run Dev

```bash
pnpm tauri dev
```

## Build Step

### MacOs

```bash
pnpm tauri build --bundles app
```

### Windows

if you are using windows, you need to build with `cargo-xwin`

```bash
pnpm tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc
```

if you are building Windows apps on Linux and macOS, please read https://v2.tauri.app/zh-cn/distribute/windows-installer/

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
