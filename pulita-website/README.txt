PULITA NEW ENERGY: WEBSITE v2 (www.pulitaenergy.com)
====================================================

An eight-page, fully responsive website presenting Pulita as a complete
gas-to-power solutions provider. Built with HTML5, CSS3 (Tailwind + custom
styles) and vanilla JavaScript. News, Projects and social links can be
edited by the client through Pages CMS (see HANDOVER.txt).


1. OPEN THE SITE LOCALLY
------------------------
Double-click index.html. Everything works offline (News and Projects use a
built-in copy of the content when opened from disk).
For a test identical to live hosting, run inside this folder:
    python3 -m http.server 8000      then open http://localhost:8000

To publish, connect the domain and set up the editor: see HANDOVER.txt.


2. PAGES
--------
index.html      Home: real-installation hero slider; data band (30,000+ m²,
                20–4,000 kVA, up to 44% efficiency, 100+ countries) with Turnkey
                EPC and Modular Design badges; product hierarchy (1 Gas
                Generators, 2 CNG Daughter Stations, 3 CNG Mother Stations,
                then other core products); ecosystem flow; completed projects
                (CMS); news & exhibitions (CMS); savings calculator; local support
about.html      Story, mission & vision, global map, quality control, certificates,
                team (John Wang, Eric Zhao, Richard Chinemelum Arannonu)
products.html   01 Gas generators (LPG, CNG/natural gas, flare gas, biogas,
                landfill gas) with the full spec table and kVA finder; 02 CNG
                daughter stations & MRUs; 03 CNG mother stations; CNG compression,
                storage & transport (CNG/LNG); PRMS/DRS skids; gas processing
solutions.html  Interactive ecosystem flowchart (gas processing → CNG compression
                → storage/transport → refuelling → power generation); MRU & Kubwa
                refilling station, Abuja; partner business model and gas supply
                partners (Vision Gas, Powergas, Portland Gas Limited, Asiko Energy;
                editable with logos in the CMS); gas-to-power; EV charging stations
projects.html   Filterable project gallery (CMS) + Burger King case study
news.html       Upcoming events + news list (CMS)
services.html   After-sales, process, gas station EPC, quote form
contact.html    Contacts, offices, Google Map, contact form

Navigation: "Products & Solutions" is a dropdown with Products and Solutions.
Solar products and imagery have been removed; solar appears only as one power
source in the EV charging solution.


3. FOLDERS
----------
content/news.json       News & exhibitions  } edited in Pages CMS
content/projects.json   Project gallery     }
content/settings.json   X / Facebook links  }
content/partners.json   Gas supply partners }
content/contact.json    Phone, WhatsApp,    }
                        email, addresses    }
content/banner.json     Home banner photos  }
assets/docs/            Downloads: LPG & CNG datasheets (PDF), SONCAP certificate
.pages.yml              Pages CMS configuration (keep this hidden file!)
assets/images/uploads/  Photos uploaded through the CMS (created on first upload)
assets/css/             tailwind.css (pre-compiled) + styles.css
assets/js/main.js       All interactions and CMS rendering
assets/js/content-fallback.js   Offline copy of content/*.json (used only
                        when opened from disk; not needed on the live site)
assets/fonts/           Barlow 400/700 & Barlow Condensed 700/800 (SIL Open Font License)
HANDOVER.txt            Hosting, DNS, CMS setup and client editing guide


4. FEATURES
-----------
- Hero slider of real installation photos (auto-advances, pausable).
- Savings calculator and LPG/CNG vs diesel comparison (brochure reference
  prices: diesel ₦2,000/L (client-confirmed), LPG ₦750/kg and CNG ₦380/m³
  (brochure reference); edit in index.html). Resulting savings vs diesel:
  LPG ~67%, CNG ~77%. These figures are used site-wide.
- Product detail pop-ups; "Request a Quote" pre-selects the product.
- kVA finder on the generator spec table.
- Interactive gas-to-power flowchart on the Solutions page.
- Upcoming events appear automatically for Exhibition/Event entries with a
  future date.
- X (Twitter) and Facebook icons in header, footer and mobile menu. They
  show "coming soon" until the links are added in the CMS.
- Floating WhatsApp button (Nigeria + factory desk).
- Scroll animations, counters and hover effects; respects "reduce motion".
- Forms open WhatsApp or email with the enquiry pre-filled.


5. TO CONFIRM WITH THE CLIENT
-----------------------------
a) Instagram: no official account was found online. Add the URL in the CMS
   (Social media links); the icon shows "coming soon" until then.
b) Home banner: no new project photos were supplied in round 5, so the
   banner still shows the three real-installation photos. Upload new photos
   in the CMS (Home page banner) or send them to the developer.
c) Veinie: name spelling (Veinie / Vinnie) and profile text to confirm. The
   supplied portrait carries a "Doubao AI generated" mark in its corner (not
   visible in the cropped team card). Consider a real photo.
d) Phone 0803 080 0999 was removed; 0810 518 5525 is now the main phone and
   WhatsApp. A second number can be added in the CMS (Contact details).
e) Case studies: application/equipment are based on the brochure and photos.
   Scope and results are only filled where known. Savings marked * are
   estimates. Add confirmed scope and results in the CMS (Projects).
f) Kubwa case-study narrative (challenge/solution wording) is draft copy.
g) LPG and CNG prices are still the brochure reference values (₦750/kg,
   ₦380/m³). Diesel is ₦2,000/L.
h) Gas supply partner logos and the Vision Gas / Portland Gas websites.
i) Abuja office street address (editable in the CMS: Contact details).
j) News items have no dates yet. Add the real dates in the CMS.


6. PHOTOS
---------
New real-installation photos (from the client's PRMS, Cascade and MRU folders):
  hero-install-genset-cascade-prms.jpg  Gas genset + CNG cascade + PRMS on site
  hero-mru-station-site.jpg             MRU refilling station on site (Abuja)
  hero-cascade-station-site.jpg         CNG cascades at the refilling station
  cng-mother-station.jpg                CNG mother station (client-supplied)
  exhibition-1.jpg ... exhibition-8.jpg  Latest exhibition stand photos (About, Services)
  team-portrait-veinie.jpg              Veinie, Sales Assistant
  soncap-certificate.jpg                Preview of the SONCAP certificate
  install-cascade-station-site.jpg      Cascades at station (storage)
  install-cascade-genset-site.jpg       Genset + cascade + PRMS cabinet
  prms-skid-closed.jpg / prms-skid-open.jpg / prms-regulator-detail.jpg
  mru-dispenser-factory.jpg / mru-open-factory.jpg / mru-units-factory.jpg
  mru-team-factory.jpg / mru-station-site-portrait.jpg / mru-compressor-detail.jpg
Earlier assets (brochure crops, supplied photos, team portraits) remain as in v1.
Removed: all solar images (inverters, PV module, hybrid site photos).

(c) Pulita New Energy Co., Ltd.


7. ROUND 5 CHANGES (Nov 2026)
-----------------------------
- Phone and WhatsApp: 0810 518 5525 everywhere.
- All contact details (phone, second phone, WhatsApp, factory WhatsApp,
  email, Lagos/Abuja addresses) are editable in the CMS: Contact details.
  They update the header, footer, contact page, Get a Quote, WhatsApp button
  and form targets.
- Social: Instagram, Facebook, LinkedIn (linked to the company page) and X
  icons in the top bar, footer, mobile menu, contact page and News page.
- About: latest exhibition photos replace the NOG photo; Richard removed;
  Veinie (Sales Assistant) added; SONCAP certificate with View/Download.
- Products: four category tiles; product finder by fuel, application and
  power; separate, simplified LPG and CNG spec tables with kVA finder;
  downloadable LPG/CNG datasheets (PDF).
- Solutions: new "Solutions by application" section (6 sectors) linking to
  filtered case studies.
- Projects: click any project for location, application, equipment,
  scope and results; new Kubwa MRU case study; links can pre-filter
  (projects.html?filter=telecom) or open a project (projects.html?case=0).
- Services: new service and project photos.
- Home banner photos are editable in the CMS.

8. FILE COUNT (for GitHub upload)
---------------------------------
The site is 81 files. Upload the CONTENTS of the pulita-website folder (not
the ZIP and not the folder itself), including the hidden .pages.yml file.
Removed to keep it lean: CSV spec tables (the PDFs cover them), duplicate
and unused photos, three font weights, and the sample upload photos.
