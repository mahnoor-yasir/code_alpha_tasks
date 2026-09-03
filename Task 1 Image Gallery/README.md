# CodeAlpha Image Gallery

A modern, fully responsive image gallery built for **CodeAlpha Frontend Development Internship – Task 1**.

**Author:** Mahnoor Yasir

## ✨ Features

- **42 categories × 50 images = 2,100 curated photos**
- Every image is **hand-aligned to its category** (no more cats under "Football")
- Real-time **search** by title or category
- Horizontally-scrollable **category chips** with emoji icons
- **Sort** by Featured / A→Z / Z→A / Liked
- **Liked-only** filter and **Dense / Comfortable** grid toggle
- **Surprise me** randomizer
- Full **lightbox** with prev / next, keyboard shortcuts (← → Esc)
- **Like / Share / Download** actions inside the lightbox
- **Dark mode** + favorites persisted via `localStorage`
- **Multi-layer fallback** (alt Unsplash crop → Picsum → SVG placeholder) so no image is ever broken
- Smooth animations, glassmorphism, responsive 1→5 column grid

## 🚀 Run locally

Just open `index.html` in your browser — no build step required.

```bash
# Optional: serve over a local server
python -m http.server 8000
# then visit http://localhost:8000
```

## 📁 Files

```
index.html    Semantic markup
styles.css    Theme tokens, responsive layout, dark mode
script.js    Curated dataset + all interactivity
README.md
```

## 🖼 Image source

Photos are loaded from **images.unsplash.com** using a hand-curated list of real photo IDs per category, guaranteeing the picture matches the label.

---

Created by **Mahnoor Yasir** | CodeAlpha Frontend Development Internship

