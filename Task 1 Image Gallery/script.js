/* ============================================================
   CodeAlpha Image Gallery — main script
   Author: Mahnoor Yasir
   ------------------------------------------------------------
   Unique image strategy:
   • 42 professional categories × 50 photos = 2,100 cards.
   • Every card uses a different locked, topic-specific image query.
   • Titles are generated from the same subject used for the image URL.
   • Fallbacks stay category-matched, then final SVG prevents broken icons.
   ============================================================ */

const DESCRIPTORS = [
  ["Close-Up", "close up"], ["Portrait", "portrait"], ["Wide View", "wide angle"], ["Golden Hour", "golden hour"], ["Natural Light", "natural light"],
  ["Outdoor Scene", "outdoor"], ["Detailed Shot", "detailed"], ["Editorial View", "editorial"], ["Soft Focus", "soft focus"], ["Vibrant Colors", "colorful"],
  ["Minimal Frame", "minimal"], ["Dramatic Angle", "dramatic"], ["Sunny Day", "sunny"], ["Moody Scene", "moody"], ["Fresh Look", "fresh"],
  ["Classic View", "classic"], ["Modern Shot", "modern"], ["Cinematic Frame", "cinematic"], ["High Detail", "high detail"], ["Clean Background", "clean background"],
  ["Scenic View", "scenic"], ["Travel Style", "travel photography"], ["Magazine Shot", "magazine"], ["Calm Moment", "calm"], ["Action View", "action"],
  ["Fine Detail", "fine detail"], ["Bright Scene", "bright"], ["Low Angle", "low angle"], ["Top View", "top view"], ["Rich Texture", "texture"],
  ["Peaceful Mood", "peaceful"], ["Sharp Focus", "sharp focus"], ["Elegant Frame", "elegant"], ["Real Moment", "realistic"], ["Premium Shot", "premium"],
  ["Fresh Perspective", "perspective"], ["Story Frame", "storytelling"], ["Atmospheric View", "atmospheric"], ["Color Study", "color study"], ["Background View", "background"],
  ["Lifestyle Shot", "lifestyle"], ["Macro Detail", "macro"], ["Natural Scene", "natural"], ["High Contrast", "high contrast"], ["Balanced Frame", "balanced"],
  ["Professional Shot", "professional"], ["Clean Detail", "clean detail"], ["Beautiful View", "beautiful"], ["Realistic Scene", "realistic scene"], ["Portfolio Frame", "portfolio"],
];

const CATEGORIES = [
  { id: "Nature", slug: "nature", emoji: "🌿", blurb: "Untouched wilderness and natural wonders.", keywords: ["nature", "landscape"], subjects: ["wild meadow", "green valley", "river landscape", "pine forest", "mountain lake", "misty hills", "spring field", "natural trail", "rocky canyon", "wild plants"] },
  { id: "Mountains", slug: "mountains", emoji: "🏔️", blurb: "Majestic peaks and alpine ranges.", keywords: ["mountain", "alpine"], subjects: ["snowy peak", "alpine ridge", "mountain valley", "rock summit", "glacier mountain", "hiking trail", "mountain lake", "highlands", "cliff range", "misty peak"] },
  { id: "Forests", slug: "forests", emoji: "🌲", blurb: "Deep woods and mystical groves.", keywords: ["forest", "trees"], subjects: ["pine forest", "rainforest path", "mossy woods", "autumn woods", "cedar trees", "forest trail", "woodland sunlight", "green canopy", "misty forest", "old growth forest"] },
  { id: "Waterfalls", slug: "waterfalls", emoji: "💧", blurb: "Cascading falls and water flow.", keywords: ["waterfalls", "cascade"], subjects: ["tall waterfall", "jungle waterfall", "rocky cascade", "forest waterfall", "mountain falls", "water stream", "misty waterfall", "hidden falls", "river cascade", "waterfall pool"] },
  { id: "Deserts", slug: "deserts", emoji: "🏜️", blurb: "Endless dunes and arid beauty.", keywords: ["desert", "sand dunes"], subjects: ["sand dunes", "sahara desert", "desert road", "cactus desert", "red dunes", "dry valley", "desert sunset", "rocky desert", "camel desert", "desert landscape"] },
  { id: "Flowers", slug: "flowers", emoji: "🌸", blurb: "Colorful blossoms and floral close-ups.", keywords: ["flower", "blossom"], subjects: ["rose flower", "tulip flower", "sunflower", "daisy flower", "orchid flower", "lavender flowers", "cherry blossom", "lily flower", "hibiscus flower", "wildflowers"] },
  { id: "Autumn", slug: "autumn", emoji: "🍂", blurb: "Warm hues of the fall season.", keywords: ["autumn", "fall leaves"], subjects: ["fall leaves", "autumn forest", "orange maple", "autumn road", "pumpkin field", "golden trees", "leaf carpet", "foggy autumn", "fall park", "autumn lake"] },
  { id: "Winter Snow", slug: "winter", emoji: "❄️", blurb: "Frosty landscapes and pure white snow.", keywords: ["winter", "snow"], subjects: ["snowy forest", "winter cabin", "snow mountain", "frozen lake", "snow path", "winter trees", "snowflakes", "icy river", "snow village", "winter landscape"] },
  { id: "Sky & Clouds", slug: "sky", emoji: "☁️", blurb: "Skyscapes from sunrise to storm.", keywords: ["sky", "clouds"], subjects: ["blue sky", "white clouds", "storm clouds", "pink clouds", "cloudscape", "sun rays", "dramatic sky", "evening clouds", "clear sky", "cloud patterns"] },
  { id: "Sunsets", slug: "sunsets", emoji: "🌅", blurb: "Golden hour all around the world.", keywords: ["sunset", "golden hour"], subjects: ["beach sunset", "mountain sunset", "city sunset", "orange sky", "sunset clouds", "lake sunset", "desert sunset", "ocean sunset", "sunset silhouette", "evening horizon"] },
  { id: "Ocean", slug: "ocean", emoji: "🌊", blurb: "Open seas and endless blue horizons.", keywords: ["ocean", "sea"], subjects: ["ocean waves", "blue sea", "open ocean", "sea horizon", "crashing waves", "turquoise water", "ocean foam", "deep sea", "rocky coast", "calm ocean"] },
  { id: "Beaches", slug: "beaches", emoji: "🏖️", blurb: "Tropical shores and sandy escapes.", keywords: ["beach", "sand"], subjects: ["tropical beach", "white sand beach", "palm beach", "beach shore", "beach umbrella", "island beach", "sunny beach", "beach waves", "sandy coast", "beach sunset"] },
  { id: "Underwater", slug: "underwater", emoji: "🐠", blurb: "Coral reefs and marine life.", keywords: ["underwater", "ocean life"], subjects: ["coral reef", "tropical fish", "sea turtle", "underwater diver", "jellyfish", "reef fish", "clear underwater", "marine life", "blue underwater", "coral garden"] },
  { id: "Travel", slug: "travel", emoji: "✈️", blurb: "Adventures from every corner of the globe.", keywords: ["travel", "destination"], subjects: ["travel backpack", "airport travel", "road trip", "passport travel", "tourist street", "scenic destination", "travel map", "train journey", "hotel view", "adventure travel"] },
  { id: "Cities", slug: "cities", emoji: "🏙️", blurb: "Vibrant skylines and urban energy.", keywords: ["city", "urban"], subjects: ["city skyline", "downtown street", "urban night", "city buildings", "busy avenue", "skyscrapers", "city lights", "metro station", "urban architecture", "street crossing"] },
  { id: "Architecture", slug: "architecture", emoji: "🏛️", blurb: "Form, structure and design at scale.", keywords: ["architecture", "building"], subjects: ["modern building", "glass facade", "historic building", "archway", "interior architecture", "concrete structure", "museum architecture", "staircase design", "geometric building", "cathedral architecture"] },
  { id: "Bridges", slug: "bridges", emoji: "🌉", blurb: "Engineering marvels spanning rivers and bays.", keywords: ["bridge", "engineering"], subjects: ["suspension bridge", "stone bridge", "city bridge", "wooden bridge", "railway bridge", "bridge at night", "river bridge", "arched bridge", "golden bridge", "pedestrian bridge"] },
  { id: "Paris", slug: "paris", emoji: "🗼", blurb: "The city of light and timeless romance.", keywords: ["paris", "france"], subjects: ["eiffel tower", "paris street", "louvre museum", "seine river", "paris cafe", "montmartre", "arc de triomphe", "paris balcony", "notre dame paris", "paris skyline"] },
  { id: "Tokyo", slug: "tokyo", emoji: "🗾", blurb: "Neon nights and Japanese culture.", keywords: ["tokyo", "japan"], subjects: ["tokyo street", "shibuya crossing", "tokyo tower", "japanese alley", "tokyo neon", "sakura tokyo", "train station tokyo", "japanese temple", "tokyo skyline", "akihabara"] },
  { id: "New York", slug: "newyork", emoji: "🗽", blurb: "The city that never sleeps.", keywords: ["new york", "nyc"], subjects: ["manhattan skyline", "times square", "brooklyn bridge", "central park", "yellow taxi", "new york street", "statue of liberty", "empire state building", "subway station", "nyc skyline"] },
  { id: "London", slug: "london", emoji: "🇬🇧", blurb: "Historic landmarks of the UK capital.", keywords: ["london", "england"], subjects: ["big ben", "tower bridge", "london street", "red bus london", "london eye", "thames river", "buckingham palace", "london taxi", "westminster", "london skyline"] },
  { id: "Food", slug: "food", emoji: "🍽️", blurb: "Delicious dishes from around the world.", keywords: ["food", "meal"], subjects: ["pasta dish", "breakfast plate", "fresh salad", "burger meal", "sushi plate", "grilled food", "healthy bowl", "restaurant dish", "street food", "dinner table"] },
  { id: "Coffee", slug: "coffee", emoji: "☕", blurb: "Espresso, latte art and cozy cafés.", keywords: ["coffee", "cafe"], subjects: ["latte art", "espresso cup", "coffee beans", "cafe table", "cappuccino", "iced coffee", "coffee shop", "black coffee", "barista", "coffee mug"] },
  { id: "Desserts", slug: "desserts", emoji: "🍰", blurb: "Sweet treats and indulgent bakes.", keywords: ["dessert", "sweet"], subjects: ["chocolate cake", "cupcake", "ice cream", "macarons", "cheesecake", "donuts", "brownie", "fruit tart", "pancakes", "cookies"] },
  { id: "Pizza", slug: "pizza", emoji: "🍕", blurb: "Hand-tossed pies and cheesy slices.", keywords: ["pizza", "cheese"], subjects: ["pepperoni pizza", "margherita pizza", "cheese pizza", "pizza slice", "wood fired pizza", "vegetable pizza", "pizza dough", "fresh pizza", "italian pizza", "pizza table"] },
  { id: "Fruits", slug: "fruits", emoji: "🍓", blurb: "Fresh, juicy and colorful.", keywords: ["fruit", "fresh"], subjects: ["strawberries", "orange fruit", "apple fruit", "banana bunch", "blueberries", "pineapple", "watermelon", "kiwi fruit", "grapes", "mango fruit"] },
  { id: "Dogs", slug: "dogs", emoji: "🐶", blurb: "Pups, breeds and very good boys.", keywords: ["dog", "puppy"], subjects: ["golden retriever", "german shepherd", "husky dog", "labrador dog", "beagle dog", "poodle dog", "bulldog", "dachshund", "border collie", "corgi dog"] },
  { id: "Cats", slug: "cats", emoji: "🐱", blurb: "Cute, curious felines.", keywords: ["cat", "kitten"], subjects: ["persian cat", "tabby cat", "siamese cat", "maine coon", "black cat", "orange kitten", "white cat", "calico cat", "sleeping cat", "curious kitten"] },
  { id: "Birds", slug: "birds", emoji: "🐦", blurb: "From songbirds to birds of prey.", keywords: ["bird", "wild bird"], subjects: ["colorful parrot", "eagle bird", "owl bird", "hummingbird", "kingfisher", "flamingo", "peacock", "sparrow", "swan bird", "bird in flight"] },
  { id: "Wildlife", slug: "wildlife", emoji: "🦁", blurb: "Animals in their natural habitat.", keywords: ["wildlife", "wild animal"], subjects: ["lion wildlife", "elephant wildlife", "giraffe", "zebra", "tiger wildlife", "deer", "fox animal", "bear wildlife", "monkey", "leopard"] },
  { id: "Horses", slug: "horses", emoji: "🐎", blurb: "Power, grace and free spirit.", keywords: ["horse", "equine"], subjects: ["running horse", "white horse", "brown horse", "horse portrait", "wild horse", "horse riding", "mare horse", "black horse", "horse herd", "farm horse"] },
  { id: "Technology", slug: "technology", emoji: "💻", blurb: "The tools shaping our future.", keywords: ["technology", "computer"], subjects: ["laptop computer", "circuit board", "data server", "coding screen", "robotics", "microchip", "ai technology", "workspace tech", "digital device", "tech desk"] },
  { id: "Smartphones", slug: "smartphones", emoji: "📱", blurb: "Pocket computers and mobile life.", keywords: ["smartphone", "mobile phone"], subjects: ["smartphone screen", "phone camera", "mobile app", "iphone", "android phone", "phone in hand", "smartphone desk", "phone photography", "charging phone", "mobile technology"] },
  { id: "Gaming", slug: "gaming", emoji: "🎮", blurb: "Controllers, consoles and pixels.", keywords: ["gaming", "video game"], subjects: ["game controller", "gaming setup", "gaming keyboard", "arcade machine", "console gaming", "esports", "gaming monitor", "video game room", "rgb setup", "headset gaming"] },
  { id: "Cars", slug: "cars", emoji: "🚗", blurb: "Classics, supercars and everyday rides.", keywords: ["car", "automobile"], subjects: ["sports car", "classic car", "red car", "luxury car", "car interior", "electric car", "race car", "vintage car", "car headlights", "city car"] },
  { id: "Motorcycles", slug: "motorcycles", emoji: "🏍️", blurb: "Two wheels and open road.", keywords: ["motorcycle", "bike"], subjects: ["sport motorcycle", "cruiser motorcycle", "motorbike road", "vintage motorcycle", "motorcycle helmet", "black motorcycle", "touring bike", "dirt bike", "motorcycle engine", "rider motorcycle"] },
  { id: "Football", slug: "football", emoji: "⚽", blurb: "The beautiful game.", keywords: ["football", "soccer"], subjects: ["soccer ball", "football player", "football stadium", "goalkeeper", "soccer field", "football boots", "goal net", "football match", "football fans", "training cones"] },
  { id: "Basketball", slug: "basketball", emoji: "🏀", blurb: "Hoops, courts and slam dunks.", keywords: ["basketball", "court"], subjects: ["basketball hoop", "basketball player", "orange basketball", "street court", "indoor court", "basketball shoes", "slam dunk", "court lines", "basketball game", "training court"] },
  { id: "Yoga", slug: "yoga", emoji: "🧘", blurb: "Balance, breath and mindful movement.", keywords: ["yoga", "meditation"], subjects: ["yoga pose", "yoga mat", "meditation pose", "yoga studio", "outdoor yoga", "yoga class", "lotus pose", "stretching yoga", "wellness yoga", "sunrise yoga"] },
  { id: "Surfing", slug: "surfing", emoji: "🏄", blurb: "Wave riders chasing the perfect swell.", keywords: ["surfing", "surfer"], subjects: ["surfer wave", "surfboard", "ocean surfing", "big wave", "surf beach", "surfer silhouette", "surf competition", "wave riding", "surf lifestyle", "tropical surf"] },
  { id: "Art", slug: "art", emoji: "🎨", blurb: "Creative expression in every form.", keywords: ["art", "creative"], subjects: ["paint brushes", "abstract painting", "artist studio", "color palette", "street art", "canvas painting", "sculpture art", "watercolor art", "gallery wall", "creative tools"] },
  { id: "Fashion", slug: "fashion", emoji: "👗", blurb: "Style, design and runway moments.", keywords: ["fashion", "style"], subjects: ["fashion model", "runway fashion", "street style", "designer dress", "fashion shoes", "clothing rack", "fashion portrait", "elegant outfit", "textile detail", "fashion accessories"] },
];

const IMAGES_PER_CATEGORY = 50;
const PAGE_SIZE = 24;

function titleCase(value) {
  return String(value).replace(/\b\w/g, c => c.toUpperCase());
}

function imagePath(terms) {
  return terms
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(encodeURIComponent)
    .join(',');
}

function topicUrl(w, h, terms, lock) {
  return `https://loremflickr.com/${w}/${h}/${imagePath(terms)}?lock=${lock}`;
}

function buildDataset() {
  const items = [];
  let uid = 1;
  CATEGORIES.forEach((cat, catIndex) => {
    for (let i = 0; i < IMAGES_PER_CATEGORY; i++) {
      const [descriptor] = DESCRIPTORS[i % DESCRIPTORS.length];
      const subject = cat.subjects[i % cat.subjects.length];
      const lock = (catIndex + 1) * 1000 + i + 1;
      const sourceTerms = [subject, ...cat.keywords];
      const fallbackTerms = [subject, cat.slug, cat.keywords[0]];
      items.push({
        id: uid++,
        title: `${titleCase(subject)} — ${descriptor}`,
        category: cat.slug,
        categoryName: cat.id,
        emoji: cat.emoji,
        blurb: cat.blurb,
        author: 'Topic-matched photo',
        thumb: topicUrl(600, 750, sourceTerms, lock),
        url: topicUrl(1600, 1100, sourceTerms, lock),
        fallbackThumb: topicUrl(600, 750, fallbackTerms, lock + 50000),
        fallbackUrl: topicUrl(1600, 1100, fallbackTerms, lock + 50000),
        sourceQuery: sourceTerms.join(' '),
      });
    }
  });
  return items;
}

const IMAGES = buildDataset();

/* ---------- STATE ---------- */
const state = {
  category: 'all',
  query: '',
  sort: 'featured',
  likedOnly: false,
  dense: false,
  visible: PAGE_SIZE,
  likes: new Set(JSON.parse(localStorage.getItem('ca_likes') || '[]')),
  theme: localStorage.getItem('ca_theme') || 'light',
  lightboxIdx: -1,
  _lbList: [],
};

/* ---------- DOM SHORTCUTS ---------- */
const $ = sel => document.querySelector(sel);

/* ---------- FINAL FALLBACK SVG ---------- */
function placeholder(label) {
  const safe = String(label).replace(/[<>&]/g, '');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 750'>
    <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0' stop-color='%236c5ce7'/><stop offset='1' stop-color='%23ff6b9d'/>
    </linearGradient></defs>
    <rect width='600' height='750' fill='url(%23g)'/>
    <text x='50%' y='47%' fill='white' font-family='Inter,Arial' font-size='30' text-anchor='middle'>${safe}</text>
    <text x='50%' y='54%' fill='white' opacity='.85' font-family='Inter,Arial' font-size='16' text-anchor='middle'>Topic-matched placeholder</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + svg;
}

/* ---------- CATEGORY-MATCHED FALLBACK HANDLER ---------- */
function handleImgError(img) {
  const step = parseInt(img.dataset.fallback || '0', 10);
  const cat = img.dataset.category || 'image';
  if (step === 0) {
    img.dataset.fallback = '1';
    img.src = img.dataset.size === 'full' ? img.dataset.fallbackFull : img.dataset.fallbackThumb;
  } else {
    img.dataset.fallback = '2';
    img.onerror = null;
    img.src = placeholder(cat);
  }
}
window.handleImgError = handleImgError;

/* ---------- FILTER / SORT / SEARCH ---------- */
function getFiltered() {
  let list = IMAGES;
  if (state.category !== 'all') list = list.filter(x => x.category === state.category);
  if (state.likedOnly) list = list.filter(x => state.likes.has(x.id));
  if (state.query.trim()) {
    const q = state.query.trim().toLowerCase();
    list = list.filter(x =>
      x.title.toLowerCase().includes(q) ||
      x.categoryName.toLowerCase().includes(q) ||
      x.sourceQuery.toLowerCase().includes(q)
    );
  }
  if (state.sort === 'az') list = [...list].sort((a,b) => a.title.localeCompare(b.title));
  if (state.sort === 'za') list = [...list].sort((a,b) => b.title.localeCompare(a.title));
  if (state.sort === 'liked') list = [...list].sort((a,b) =>
    (state.likes.has(b.id) ? 1 : 0) - (state.likes.has(a.id) ? 1 : 0));
  return list;
}

/* ---------- RENDER GALLERY ---------- */
function renderGallery() {
  const grid = $('#grid');
  const list = getFiltered();
  const slice = list.slice(0, state.visible);
  grid.className = 'grid' + (state.dense ? ' dense' : '');
  if (!slice.length) {
    grid.innerHTML = `<div class="empty">No images match your filters. Try clearing the search.</div>`;
    $('#loadMoreWrap').style.display = 'none';
    $('#resultCount').textContent = '0 results';
    return;
  }
  grid.innerHTML = slice.map((img, idx) => `
    <figure class="card" data-idx="${idx}" tabindex="0">
      <div class="card-img-wrap">
        <img loading="lazy" src="${img.thumb}" alt="${img.title}"
             data-category="${img.categoryName}" data-fallback-thumb="${img.fallbackThumb}"
             data-fallback-full="${img.fallbackUrl}" onerror="handleImgError(this)" />
        <button class="like-btn ${state.likes.has(img.id) ? 'liked' : ''}"
                data-id="${img.id}" aria-label="Like">${state.likes.has(img.id) ? '❤️' : '🤍'}</button>
        <div class="card-overlay">
          <span class="card-cat">${img.emoji} ${img.categoryName}</span>
          <span class="card-zoom">🔍 Preview</span>
        </div>
      </div>
      <figcaption>
        <strong>${img.title}</strong>
        <span class="card-author">📷 ${img.author}</span>
      </figcaption>
    </figure>
  `).join('');
  $('#resultCount').textContent = `${list.length} result${list.length === 1 ? '' : 's'}`;
  $('#loadMoreWrap').style.display = state.visible < list.length ? 'flex' : 'none';

  grid.querySelectorAll('.card').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.like-btn')) return;
      openLightbox(parseInt(el.dataset.idx, 10));
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') openLightbox(parseInt(el.dataset.idx, 10));
    });
  });
  grid.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleLike(parseInt(btn.dataset.id, 10));
    });
  });
}

/* ---------- CATEGORY CHIPS ---------- */
function renderChips() {
  const chips = $('#chips');
  const all = [{ id:'all', idName:'All', name:'All', emoji:'🌐', slug:'all' }, ...CATEGORIES.map(c => ({ ...c, idName: c.id, name: c.id }))];
  chips.innerHTML = all.map(c => `
    <button class="chip ${state.category === c.slug ? 'active' : ''}" data-cat="${c.slug}">
      <span>${c.emoji}</span> ${c.name}
    </button>
  `).join('');
  chips.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      state.visible = PAGE_SIZE;
      renderChips();
      renderGallery();
    });
  });
}

/* ---------- CATEGORY SHOWCASE ---------- */
function renderCategoryGrid() {
  const wrap = $('#categoryGrid');
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map(c => `
    <button class="cat-card" data-cat="${c.slug}">
      <span class="cat-emoji">${c.emoji}</span>
      <strong>${c.id}</strong>
      <span class="cat-count">${IMAGES_PER_CATEGORY} unique photos</span>
    </button>
  `).join('');
  wrap.querySelectorAll('.cat-card').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      state.visible = PAGE_SIZE;
      renderChips();
      renderGallery();
      document.getElementById('gallery').scrollIntoView({ behavior:'smooth' });
    });
  });
}

/* ---------- LIKES ---------- */
function toggleLike(id) {
  if (state.likes.has(id)) state.likes.delete(id); else state.likes.add(id);
  localStorage.setItem('ca_likes', JSON.stringify([...state.likes]));
  renderGallery();
  updateLikedCount();
}
function updateLikedCount() {
  $('#likedCount') && ($('#likedCount').textContent = state.likes.size);
}

/* ---------- LIGHTBOX ---------- */
function openLightbox(idx) {
  const list = getFiltered().slice(0, state.visible);
  state._lbList = list;
  state.lightboxIdx = idx;
  showLightbox();
}
function showLightbox() {
  const lb = $('#lightbox');
  const img = state._lbList[state.lightboxIdx];
  if (!img) return;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  const lbImg = $('#lbImg');
  lbImg.dataset.fallback = '0';
  lbImg.dataset.category = img.categoryName;
  lbImg.dataset.fallbackThumb = img.fallbackThumb;
  lbImg.dataset.fallbackFull = img.fallbackUrl;
  lbImg.dataset.size = 'full';
  lbImg.onerror = function(){ handleImgError(this); };
  lbImg.src = img.url;
  $('#lbTitle').textContent = img.title;
  $('#lbCat').textContent = `${img.emoji} ${img.categoryName}`;
  $('#lbBlurb').textContent = img.blurb;
  $('#lbCounter').textContent = `${state.lightboxIdx + 1} / ${state._lbList.length}`;
  $('#lbLike').textContent = state.likes.has(img.id) ? '❤️ Liked' : '🤍 Like';
  $('#lbLike').onclick = () => { toggleLike(img.id); showLightbox(); };
  $('#lbDownload').onclick = () => downloadImage(img);
  $('#lbShare').onclick = () => shareImage(img);
}
function closeLightbox() {
  $('#lightbox').classList.remove('open');
  document.body.style.overflow = '';
  state.lightboxIdx = -1;
}
function nextLb() {
  state.lightboxIdx = (state.lightboxIdx + 1) % state._lbList.length;
  showLightbox();
}
function prevLb() {
  state.lightboxIdx = (state.lightboxIdx - 1 + state._lbList.length) % state._lbList.length;
  showLightbox();
}
async function downloadImage(img) {
  try {
    const res = await fetch(img.url, { mode:'cors' });
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${img.title.replace(/\s+/g,'_')}.jpg`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } catch { window.open(img.url, '_blank'); }
}
async function shareImage(img) {
  const shareData = { title: img.title, text: `Check out ${img.title} on CodeAlpha Gallery`, url: img.url };
  if (navigator.share) { try { await navigator.share(shareData); } catch {} }
  else {
    try { await navigator.clipboard.writeText(img.url); alert('Image link copied to clipboard!'); }
    catch { window.open(img.url, '_blank'); }
  }
}

/* ---------- THEME ---------- */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  $('#themeToggle').textContent = state.theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('ca_theme', state.theme);
}

/* ---------- HERO STATS ANIMATION ---------- */
function animateStats() {
  const total = IMAGES.length;
  const cats = CATEGORIES.length;
  animateNumber('#statImages', total);
  animateNumber('#statCats', cats);
  animateNumber('#statSubs', cats);
  $('#totalCountHero') && ($('#totalCountHero').textContent = total.toLocaleString() + '+');
  $('#categoryCountHero') && ($('#categoryCountHero').textContent = cats);
}
function animateNumber(sel, target) {
  const el = $(sel); if (!el) return;
  let cur = 0; const step = Math.max(1, Math.ceil(target / 60));
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = cur.toLocaleString();
  }, 25);
}

/* ---------- SCROLL TO TOP ---------- */
function setupScrollTop() {
  const btn = $('#scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  renderChips();
  renderCategoryGrid();
  renderGallery();
  animateStats();
  updateLikedCount();
  setupScrollTop();

  $('#search').addEventListener('input', e => {
    state.query = e.target.value; state.visible = PAGE_SIZE; renderGallery();
  });
  $('#sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderGallery(); });
  $('#likedToggle').addEventListener('click', () => {
    state.likedOnly = !state.likedOnly;
    $('#likedToggle').classList.toggle('active', state.likedOnly);
    renderGallery();
  });
  $('#denseToggle').addEventListener('click', () => {
    state.dense = !state.dense;
    $('#denseToggle').classList.toggle('active', state.dense);
    renderGallery();
  });
  $('#surprise').addEventListener('click', () => {
    const list = getFiltered();
    if (!list.length) return;
    const r = Math.floor(Math.random() * Math.min(list.length, state.visible));
    openLightbox(r);
  });
  $('#loadMore').addEventListener('click', () => { state.visible += PAGE_SIZE; renderGallery(); });
  $('#themeToggle').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme();
  });

  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbNext').addEventListener('click', nextLb);
  $('#lbPrev').addEventListener('click', prevLb);
  $('#lightbox').addEventListener('click', e => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (state.lightboxIdx < 0) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLb();
    if (e.key === 'ArrowLeft') prevLb();
  });
});
