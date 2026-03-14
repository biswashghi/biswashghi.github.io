# Personal Website

This project is a personal website that showcases a resume, blog, contact information, and project details. The design is inspired by the characteristics of Claude Code websites, focusing on clean aesthetics and user-friendly navigation.

## Project Structure

```
personal-website
├── public
│   ├── favicon.ico          # Favicon for the website
│   └── index.html           # Main HTML file
├── src
│   ├── assets
│   │   ├── css
│   │   │   └── styles.css   # CSS styles for the website
│   │   └── js
│   │       └── scripts.js    # JavaScript for interactive features
│   ├── components
│   │   ├── Blog
│   │   │   └── BlogPost.js   # Component for individual blog posts
│   │   ├── Contact
│   │   │   └── ContactForm.js # Component for the contact form
│   │   ├── Projects
│   │   │   └── ProjectCard.js # Component for project details
│   │   └── Resume
│   │       └── ResumeSection.js # Component for resume sections
│   ├── pages
│   │   ├── Blog.js           # Page component for the blog section
│   │   ├── Contact.js        # Page component for the contact section
│   │   ├── Home.js          # Home page component
│   │   └── Projects.js       # Page component for the projects section
│   └── index.js              # Main JavaScript entry point
├── package.json              # npm configuration file
├── README.md                 # Project documentation
└── .gitignore                # Files to be ignored by version control
```

## Features

- **Resume Section**: Displays work experience and education.
- **Blog**: A section for sharing articles and insights.
- **Contact Form**: Allows visitors to get in touch.
- **Projects**: Showcases individual projects with descriptions and links.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd personal-website
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
    npm start
   ```

## Notes

- This is a single-page React app (React Router). Deep links like `/blog` work in dev because webpack-dev-server is configured with `historyApiFallback`.
- Customize your name/tagline/navigation in `src/App.js`.
- If you deploy under a sub-path (example: GitHub Pages), set `PUBLIC_PATH=/your-sub-path/` when building so assets load from the right base URL.
- GitHub Pages SPA support: the build script generates `dist/404.html` (a copy of `index.html`) so deep links like `/blog/teaching-web-systems` load correctly on GitHub Pages.

## Deploy To GitHub Pages

1. Push this repo to `https://github.com/biswashghi/biswashghi.github.io` on the `main` branch.
2. In GitHub: `Settings -> Pages -> Source -> GitHub Actions`.
3. Push to `main`. The workflow in `.github/workflows/pages.yml` builds and deploys the site.

## License

This project is licensed under the MIT License.
