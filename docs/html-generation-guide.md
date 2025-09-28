# HTML Portfolio Generation Guide

This guide explains how to generate static HTML portfolios from JSON data and preview them locally.

## Prerequisites

- Node.js installed on your system
- Python 3 installed (for live preview server)
- Portfolio JSON data file

## Quick Start

### 1. Generate HTML Portfolio

```bash
# Navigate to the project directory
cd "/home/long/Desktop/Aurea Frontend/Aurea-frontend"

# Generate HTML from JSON data
node scripts/generateExactHTML.js [input-json-file] [output-html-name]
```

**Example:**
```bash
node scripts/generateExactHTML.js user-portfolio-data2.json my-portfolio.html
```

### 2. Live Preview

Start a local HTTP server to preview your generated HTML:

```bash
# Start Python HTTP server on port 8080
python3 -m http.server 8080
```

Then open your browser and navigate to:
- **Main server:** http://localhost:8080
- **Generated HTML:** http://localhost:8080/html-output/[your-html-file].html

**Example:**
```
http://localhost:8080/html-output/my-portfolio.html
```

## Detailed Usage

### Input JSON Structure

Your portfolio JSON should follow this structure:

```json
{
  "_id": "unique-id",
  "title": "Portfolio Title",
  "description": "Portfolio Description",
  "template": "minimal-designer",
  "sections": [
    {
      "type": "hero",
      "content": {
        "name": "Your Name",
        "title": "Your Professional Title",
        "description": "Your description",
        "image": "",
        "background": "#f8fafc"
      }
    },
    {
      "type": "about",
      "content": {
        "heading": "About Me",
        "content": "Your bio content",
        "image": "",
        "skills": ["Skill 1", "Skill 2", "Skill 3"]
      }
    },
    {
      "type": "contact",
      "content": {
        "heading": "Let's Work Together",
        "description": "Contact description",
        "form_fields": ["name", "email", "message"],
        "social_links": [
          {
            "platform": "Platform Name",
            "url": "https://your-url.com"
          }
        ]
      }
    },
    {
      "type": "projects",
      "content": []
    }
  ],
  "styling": {
    "colors": {
      "primary": "#1f2937",
      "secondary": "#6b7280",
      "accent": "#1f2937",
      "background": "#ffffff",
      "surface": "#f8fafc",
      "text": "#1f2937",
      "textSecondary": "#6b7280"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter",
      "accent": "Inter"
    },
    "spacing": {
      "section": "5rem",
      "element": "2rem",
      "tight": "1rem"
    },
    "borderRadius": {
      "small": "0.375rem",
      "medium": "0.5rem",
      "large": "0.75rem"
    },
    "shadows": {
      "small": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "medium": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      "large": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    }
  }
}
```

### Output Location

Generated HTML files are saved in the `html-output/` directory with the following structure:

```
html-output/
├── your-portfolio.html
├── another-portfolio.html
└── ...
```

## Complete Workflow

### Step-by-Step Process

1. **Prepare your JSON data**
   ```bash
   # Make sure your JSON file is in the project root
   ls *.json
   ```

2. **Generate HTML portfolio**
   ```bash
   node scripts/generateExactHTML.js user-portfolio-data2.json my-portfolio.html
   ```

3. **Start live preview server**
   ```bash
   python3 -m http.server 8080
   ```

4. **Open in browser**
   ```
   http://localhost:8080/html-output/my-portfolio.html
   ```

5. **View and test your portfolio**
   - Check responsive design on different screen sizes
   - Test all links and forms
   - Verify font and styling appearance

## Advanced Usage

### Custom Styling

The generated HTML respects all styling configurations from your JSON:

- **Colors:** Primary, secondary, accent, background, surface, text colors
- **Typography:** Font families for heading, body, and accent text
- **Spacing:** Section, element, and tight spacing values
- **Border Radius:** Small, medium, and large border radius values
- **Shadows:** Small, medium, and large shadow configurations

### Font Configuration

The script automatically:
- Uses fonts specified in `styling.fonts.heading` or `styling.fonts.body`
- Loads fonts from Google Fonts with proper weights (300, 400, 500, 600, 700)
- Applies fonts through Tailwind CSS configuration

### Project Handling

- **With Projects:** Displays project grid with proper masonry layout
- **Empty Projects:** Shows "No Projects Yet" message with helpful text
- **Statistics:** Dynamically calculates project count and technology count

### Contact Form

The script conditionally renders:
- **Contact Form:** When `form_fields` array exists in contact section
- **Social Links:** When `social_links` array exists in contact section
- **Both:** When both arrays are present

## Troubleshooting

### Common Issues

1. **Font not loading properly**
   - Check internet connection (fonts load from Google Fonts)
   - Clear browser cache
   - Verify font name in JSON styling configuration

2. **HTML not generating**
   - Verify JSON file exists and is valid
   - Check file permissions
   - Ensure Node.js is installed

3. **Live preview not working**
   - Verify Python 3 is installed
   - Check if port 8080 is available
   - Try a different port: `python3 -m http.server 3000`

### Alternative Preview Methods

If Python HTTP server doesn't work, try:

```bash
# Using Node.js http-server (if installed)
npx http-server -p 8080

# Using PHP (if installed)
php -S localhost:8080

# Using Live Server VS Code extension
# Right-click HTML file → "Open with Live Server"
```

## File Structure

```
Aurea-frontend/
├── scripts/
│   └── generateExactHTML.js          # Main generation script
├── html-output/                      # Generated HTML files
│   ├── portfolio-1.html
│   └── portfolio-2.html
├── docs/                            # Documentation
│   └── html-generation-guide.md    # This guide
├── user-portfolio-data2.json       # Example JSON data
└── README.md                       # Project README
```

## Examples

### Generate Multiple Portfolios

```bash
# Generate different portfolios
node scripts/generateExactHTML.js portfolio-1.json john-doe-portfolio.html
node scripts/generateExactHTML.js portfolio-2.json jane-smith-portfolio.html
node scripts/generateExactHTML.js portfolio-3.json company-portfolio.html

# Start preview server
python3 -m http.server 8080

# View portfolios
# http://localhost:8080/html-output/john-doe-portfolio.html
# http://localhost:8080/html-output/jane-smith-portfolio.html
# http://localhost:8080/html-output/company-portfolio.html
```

### Batch Generation Script

Create a batch script for multiple portfolios:

```bash
#!/bin/bash
# generate-all.sh

portfolios=(
    "user-portfolio-data2.json:mine-portfolio.html"
    "another-portfolio.json:another-portfolio.html"
)

for portfolio in "${portfolios[@]}"; do
    input=$(echo $portfolio | cut -d: -f1)
    output=$(echo $portfolio | cut -d: -f2)
    echo "Generating $output from $input..."
    node scripts/generateExactHTML.js "$input" "$output"
done

echo "All portfolios generated! Starting preview server..."
python3 -m http.server 8080
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your JSON structure matches the expected format
3. Ensure all required dependencies are installed
4. Check the console for any error messages

---

**Happy portfolio generating! 🚀**