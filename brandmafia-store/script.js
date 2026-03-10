// ===== HERO SLIDER =====
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dotsContainer = document.getElementById('heroDots');

function initSlider() {
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  setInterval(() => nextSlide(), 5000);
}

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dotsContainer.children[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dotsContainer.children[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

// ===== HEADER SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// ===== SEARCH =====
function toggleSearch() {
  document.getElementById('searchOverlay').classList.toggle('active');
}

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById('nav').classList.toggle('active');
}

// ===== COUNTDOWN TIMER =====
function startCountdown() {
  let totalSeconds = 8 * 3600 + 45 * 60 + 30;
  function tick() {
    if (totalSeconds <= 0) totalSeconds = 8 * 3600 + 45 * 60 + 30;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
    totalSeconds--;
  }
  tick();
  setInterval(tick, 1000);
}

// ===== FADE IN ON SCROLL =====
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== PRODUCT DETAIL MODAL =====
function openProductModal(product) {
  var modal = document.getElementById('productModal');
  var ratingNum = parseFloat(product.rating);
  var stars5 = '\u2605'.repeat(Math.round(ratingNum)) + '\u2606'.repeat(5 - Math.round(ratingNum));
  document.getElementById('modalImg').src = product.img;
  document.getElementById('modalImg').alt = product.name;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalStars').textContent = stars5;
  document.getElementById('modalRating').textContent = product.rating + ' / 5';
  document.getElementById('modalPrice').textContent = '\u20B9' + product.price;
  document.getElementById('modalOldPrice').textContent = product.oldPrice ? '\u20B9' + product.oldPrice : '';
  document.getElementById('modalOldPrice').style.display = product.oldPrice ? 'inline' : 'none';
  document.getElementById('modalDesc').textContent = product.desc || 'Premium quality product from BrandMafia Store. 100% quality assured with replacement guarantee.';
  document.getElementById('modalWhatsApp').href = 'https://wa.me/9891021424?text=Hi! I am interested in: ' + encodeURIComponent(product.name) + ' (\u20B9' + product.price + ')';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', function(e) {
  if (e.target.id === 'productModal') closeProductModal();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeProductModal();
});

// ===== PRODUCT DATA =====
const products = [
  { name: 'Alpine Loop Strap for Apple Watch', img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', price: '195', rating: '5.00', badge: 'Best', desc: 'Premium Alpine Loop Strap for Apple Watch 49mm/45mm/44mm/42mm. Durable and comfortable.' },
  { name: 'Stylus Pen for iPad, Mobile and Tablet', img: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop', price: '1,500', rating: '5.00', desc: 'High precision stylus pen for iPad, Android tablets and smartphones. Palm rejection.' },
  { name: 'Apple Series 8 Watch (Copy) 45mm', img: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop', price: '1,700', rating: '4.58', desc: 'Apple Watch Series 8 Super Clone 45mm. Retina display, health monitoring, GPS.' },
  { name: 'Mag Safe Wireless Charger 15W', img: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=400&h=400&fit=crop', price: '1,300', rating: '4.50', desc: 'MagSafe 15W fast wireless charger for iPhones and QI devices. Magnetic design.' },
  { name: 'Airpods 2nd Generation Mastercopy', img: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop', price: '1,200', rating: '4.50', desc: 'Airpods 2nd Gen with premium sound. Touch controls, auto-pairing, long battery.' },
  { name: 'iPhone 20W Fast Charger & Cable', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop', price: '900', rating: '4.50', desc: '20W USB-C fast charger with Lightning cable. Charge iPhone 50% in 30 minutes.' },
  { name: 'Airpods Pro 2 + Free Cover - Master Quality', img: 'https://thegadgetx.in/cdn/shop/files/IMG_9480.webp?v=1766926164&width=416', price: '1,099', rating: '4.71', badge: 'Hot', desc: 'Pods Pro 2 + Free Cover - Master Quality | 1 Yr Warranty. Exactly like OG, All features working. ANC, H2 Chip, Spatial Audio, Dolby Atmos.', link: 'airpods-pro-2.html' },
  { name: 'Airpods Pro 1st Gen Mastercopy', img: 'https://images.unsplash.com/photo-1588423771073-b8903fde1c68?w=400&h=400&fit=crop', price: '1,350', rating: '4.29', desc: 'Airpods Pro 1st Gen with ANC. Transparency mode, spatial audio, sweat resistant.' },
  { name: 'Sonilex Vibe SLBS1811 Bluetooth Speaker', img: 'https://5.imimg.com/data5/SELLER/Default/2025/9/544387780/BI/QB/MP/109762228/image-500x500.jpeg', price: '260', rating: '4.20', badge: 'New', desc: 'Sonilex Vibe SLBS1811 Bluetooth Speaker with 10W output. Balanced sound quality with clear vocals and smooth bass. Easy wireless pairing via Bluetooth. Compact and durable ABS body, ideal for indoor and outdoor use.' },
  { name: 'Portable Neck Fan - Bladeless 4000mAh', img: 'https://m.media-amazon.com/images/I/61Fa85X0GNL._AC_SL1500_.jpg', price: '499', rating: '3.80', desc: 'Portable Hands-Free Bladeless Neck Fan with 4000mAh rechargeable battery. USB charging, headphone design, 3 speed settings. Perfect for outdoor activities, gym, travel, and daily commute. Lightweight and comfortable wear.' },
  { name: 'G Speaker Lamp - 3 in 1 Bluetooth Speaker', img: 'https://uk-technology.com/cdn/shop/files/Untitleddesign-2024-10-18T123118.383-683822.jpg?v=1739265321&width=1500', price: '1,299', rating: '5.00', badge: 'Hot', desc: 'Constellation Mart G Speaker Lamp - APP Control 3 in 1 Multi-Function Bluetooth Speaker with Wireless Fast Charging, RGB Light and Sunrise effect. Perfect for bedroom and bedside table. Premium ambient lighting with quality audio.' },
  { name: 'Buds Pro 3 TWS Bluetooth Earbuds', img: 'https://m.media-amazon.com/images/I/51W54xJpcCL._AC_UF1000,1000_QL80_.jpg', price: '899', rating: '4.50', badge: 'Best', desc: 'Buds Pro 3 TWS in-Ear Bluetooth Earbuds with Dual Drivers. Premium glossy finish, deep bass, HD sound quality. Smart touch controls for calls, music and voice assistant. Lightweight and comfortable for all-day wear.' },
];

const coverProducts = [
  { name: 'Airpods Pro 2nd Gen ANC with Camera Case', img: 'https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=400&h=400&fit=crop', price: '1,800', rating: '5.00', desc: 'Airpods Pro 2nd Gen ANC with Camera-style silicone case. Premium audio + unique style.' },
  { name: 'Airpods Pro 2nd Gen ANC with Xbox Case', img: 'https://images.unsplash.com/photo-1629367494173-c78a56567877?w=400&h=400&fit=crop', price: '1,800', rating: '5.00', desc: 'Airpods Pro 2nd Gen ANC with Xbox controller case. Perfect for gamers!' },
  { name: 'Airpods Pro 2 ANC with Ice Cream Case', img: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop', price: '1,800', rating: '4.75', desc: 'Airpods Pro 2 ANC with fun Ice Cream shaped case. Stand out from the crowd!' },
  { name: 'Airpods Pro 2nd Gen ANC with Robot Cover', img: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop', price: '1,800', rating: '4.50', desc: 'Airpods Pro 2nd Gen ANC with Robot silicone cover. Fun and protective.' },
  { name: 'Airpods Pro 2 ANC with Radio Case', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', price: '1,800', rating: '4.00', desc: 'Airpods Pro 2 ANC with retro Radio-style case. Vintage vibes, modern tech.' },
  { name: 'Airpods Pro 2nd Gen ANC with Starbucks Case', img: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop', price: '1,800', rating: '4.00', desc: 'Airpods Pro 2nd Gen ANC with Starbucks cup case. Coffee lover essential!' },
];

function createProductCard(p) {
  var ratingNum = parseFloat(p.rating);
  var stars5 = '\u2605'.repeat(Math.round(ratingNum)) + '\u2606'.repeat(5 - Math.round(ratingNum));
  var dataStr = JSON.stringify(p).replace(/"/g, '&quot;');
  var clickAction = p.link ? 'window.location.href="' + p.link + '"' : 'openProductModal(' + JSON.stringify(p).replace(/'/g, "\\'") + ')';
  return '<div class="product-card fade-in" style="cursor:pointer" onclick=\'' + clickAction + '\'>' +
    '<div class="product-img">' +
      (p.badge ? '<span class="product-badge">' + p.badge + '</span>' : '') +
      '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy"/>' +
    '</div>' +
    '<div class="product-info">' +
      '<h3>' + p.name + '</h3>' +
      '<div class="product-rating"><div class="stars">' + stars5 + '</div><span>' + p.rating + '</span></div>' +
      '<div class="product-price"><span class="price-now">\u20B9' + p.price + '</span></div>' +
      '<button class="btn btn-black btn-sm">View Details</button>' +
    '</div>' +
  '</div>';
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (grid) grid.innerHTML = products.map(createProductCard).join('');

  const coverScroll = document.getElementById('coverScroll');
  if (coverScroll) coverScroll.innerHTML = coverProducts.map(createProductCard).join('');

  // Re-observe fade-in elements
  initFadeIn();
}

// ===== NAV CLOSE ON LINK CLICK =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav').classList.remove('active');
  });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  startCountdown();
  renderProducts();
  initFadeIn();
});
