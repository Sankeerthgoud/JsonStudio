# JSON Viewer

A sleek and modern web application for viewing, beautifying, and comparing JSON data.

## Features

- **JSON Beautifier**: Format raw/minified JSON with syntax highlighting
- **Tree View**: Interactive collapsible JSON structure
- **JSON Compare**: Side-by-side comparison of JSON objects
- **Dark Mode**: Toggle between light and dark themes
- **Keyboard Shortcuts**:
  - Ctrl+B: Beautify JSON
  - Ctrl+E: Expand all in Tree View
  - Ctrl+C: Collapse all in Tree View
- **Copy & Download**: Copy beautified JSON or download as file

## Usage

1. Clone or download the project
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:5175

## Technologies

- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- react-syntax-highlighter

## Project Structure

```
src/
├── components/
│   ├── BeautifyPanel.jsx
│   ├── TreeViewPanel.jsx
│   ├── ComparePanel.jsx
│   └── ui/ (button, textarea, tabs)
├── lib/utils.js
├── App.jsx
└── index.css
