# SVG to CSS Background Converter

A beautiful, simple web application that converts SVG code to CSS `background-image` format using Data URI encoding.

## Features

- **Real-time conversion** - See results instantly as you type
- **One-click copy** - Copy CSS to clipboard with a single click
- **Beautiful UI** - Modern gradient design with smooth animations
- **Responsive** - Works perfectly on desktop and mobile
- **Example templates** - Quick-start with pre-built SVG examples
- **Keyboard shortcuts** - 
  - `Ctrl/Cmd + Enter`: Copy to clipboard
  - `Esc`: Clear input

## How to Use

1. Open `index.html` in your web browser
2. Paste your SVG code in the left textarea
3. The CSS output will appear automatically in the right textarea
4. Click "Copy" to copy the CSS to your clipboard
5. Use the CSS in your stylesheets!

## Example Usage

**Input (SVG):**
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#e74c3c"/>
</svg>
```

**Output (CSS):**
```css
background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2U3NGMzYyIvPjwvc3ZnPg==");
```

## Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No dependencies, pure performance

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- Clipboard API (with fallback for older browsers)

## License

MIT License - Feel free to use and modify!

