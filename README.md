# Xiaoyi Peng - Personal Website

A clean and responsive portfolio website showcasing photography and research work.

## 🚀 GitHub Pages Hosting

This website is hosted on GitHub Pages, providing simple and reliable static hosting.

### Project Structure

```
my_web/
├── index.html              # Main homepage
├── gallery.html            # Photo gallery page
├── research.html           # Research & projects page
├── assets/                 # Image assets
├── styles/                 # CSS stylesheets
├── js/                     # JavaScript files
├── robots.txt              # Search engine directives
└── README.md               # This file
```

### Local Development

To run the website locally for development:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd my_web
   ```

2. **Serve locally** (choose one):
   ```bash
   # Using Python (recommended)
   python -m http.server 8000
   
   # Using Node.js (if you have it installed)
   npx serve .
   
   # Using PHP (if available)
   php -S localhost:8000
   ```

3. **Open in browser**:
   Visit `http://localhost:8000`

### Deployment

The website automatically deploys to GitHub Pages when changes are pushed to the main branch. No build process is required as this is a static website.

### Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Photo Gallery**: Interactive freeform gallery layout
- **Clean Navigation**: Easy access to all sections
- **SEO Optimized**: Proper meta tags and search engine directives

### Gallery

The photo gallery uses a custom JavaScript layout engine that:
- Dynamically arranges photos in an aesthetic freeform layout
- Maintains aspect ratios and prevents overlapping
- Loads images efficiently with lazy loading
- Provides a smooth browsing experience

### Image Management

Images are stored in the `assets/` directory and served directly as static files. The gallery automatically loads all images defined in the `gallery-freeform.js` file.

To add new images:
1. Add image files to the `assets/` directory
2. Update the image list in `js/gallery-freeform.js`
3. Commit and push changes

### Performance

- **Optimized Images**: All images are optimized for web delivery
- **Minimal Dependencies**: Uses only vanilla JavaScript and CSS
- **Fast Loading**: Static hosting ensures quick page loads
- **CDN Delivery**: GitHub Pages provides global CDN distribution

---

*Built with care for the web.* 
