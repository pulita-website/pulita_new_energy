PULITA NEW ENERGY WEBSITE (www.pulitaenergy.com)
================================================

A nine-page, fully responsive website built with HTML5, CSS3 (Tailwind +
custom styles) and plain JavaScript. There is no build step: the files in
this folder are the finished website.

PAGES
  index.html        Home
  about.html        About
  products.html     Products (CNG, LPG and biogas generators, CNG cascade,
                    MRU, PRMS) with spec tables and PDF datasheets
  solutions.html    Solutions
  projects.html     Projects and case studies
  news.html         News & exhibitions
  services.html     Services and quote form
  spare-parts.html  Spare parts
  contact.html      Contact

FOLDERS
  assets/css/       styles.css, tailwind.css (design)
  assets/js/        main.js (menus, banner, gallery, calculator, CMS loading),
                    content-fallback.js (offline copy of the CMS content)
  assets/images/    all site photos; uploads/ holds photos added in the CMS
  assets/docs/      PDF datasheets and spec sheets, SONCAP certificate;
                    uploads/ holds PDFs added in the CMS
  content/          CMS content (JSON): news, projects, banner, contact,
                    settings (social links), spare-parts, datasheets,
                    page-*.json (each page's headlines, text and main photos)

EDITING
  Day-to-day content is edited in Pages CMS (app.pagescms.org). The CMS
  settings file .pages.yml sits at the TOP of the repository, next to this
  pulita-website folder.

HOSTING
  See "Pulita Website - Owner Setup and Hosting Guide.pdf" and HANDOVER.txt.
  Vercel: Root Directory = pulita-website, Framework Preset = Other.
  Netlify: Base directory empty, Publish directory = pulita-website.

OPEN LOCALLY
  Double-click index.html, or run "python3 -m http.server 8000" inside this
  folder and open http://localhost:8000.
