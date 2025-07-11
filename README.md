# Web Photo Gallery

A clean, static photo gallery website.

## Features

- **Static Gallery Layout**: Clean, non-interactive design with sharp corners
- **Smart Image Organization**: 2-3 images per row with equal-width distribution
- **Featured Image**: One image gets full-width treatment and appears in random position
- **Responsive Design**: Optimized for different screen sizes
- **Fast Loading**: Optimized images

## Structure

```
my_cv_web/
├── assets/          # Image files
├── styles/          # CSS and JavaScript files
├── gallery.html     # Main gallery page
├── home.html        # Homepage
├── research.html    # Research page
└── index.html       # Entry point
```

## Local Development

1. Navigate to the project directory:
   ```bash
   cd my_cv_web
   ```

2. Start a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```

3. Open your browser to:
   ```
   http://localhost:8000
   ```

## Gallery Features

- **Featured Image**: One image with full-width display, positioned randomly
- **Image Collection**: Collection of images
- **Static Layout**: No drag-and-drop or editing functionality
- **Clean Design**: Minimal styling with focus on content

## Security

- Comprehensive `.gitignore` for sensitive files
- No server-side processing required
- Static file hosting compatible

## Browser Compatibility

- Modern browsers with JavaScript enabled
- Responsive design for mobile and desktop

## License

Personal collection. All rights reserved. 