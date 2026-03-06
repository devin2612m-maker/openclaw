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

// ===== PRODUCT DATA =====
const products = [
  { name: 'Alpine Loop Strap for Apple Watch', img: 'https://placehold.co/400x400/f8f8f8/333?text=Alpine+Strap', price: '195', rating: '5.00', badge: 'Best' },
  { name: 'Stylus Pen for iPad, Mobile and Tablet', img: 'https://placehold.co/400x400/f8f8f8/333?text=Stylus+Pen', price: '1,500', rating: '5.00' },
  { name: 'Apple Series 8 Watch (Copy) 45mm', img: 'https://placehold.co/400x400/f8f8f8/333?text=Watch+S8', price: '1,700', rating: '4.58' },
  { name: 'Mag Safe Wireless Charger 15W', img: 'https://placehold.co/400x400/f8f8f8/333?text=MagSafe', price: '1,300', rating: '4.50' },
  { name: 'Airpods 2nd Generation Mastercopy', img: 'https://placehold.co/400x400/f8f8f8/333?text=Airpods+2', price: '1,200', rating: '4.50' },
  { name: 'iPhone 20W Fast Charger & Cable', img: 'https://placehold.co/400x400/f8f8f8/333?text=Charger+20W', price: '900', rating: '4.50' },
  { name: 'Airpods Pro 2 ANC with Free Silicon Case', img: 'https://placehold.co/400x400/f8f8f8/333?text=Airpods+ANC', price: '1,750', rating: '4.34' },
  { name: 'Airpods Pro 1st Gen Mastercopy', img: 'https://placehold.co/400x400/f8f8f8/333?text=Airpods+Pro+1', price: '1,350', rating: '4.29' },
];

const coverProducts = [
  { name: 'Airpods Pro 2nd Gen ANC with Camera Case', img: 'https://placehold.co/400x400/f8f8f8/333?text=Camera+Case', price: '1,800', rating: '5.00' },
  { name: 'Airpods Pro 2nd Gen ANC with Xbox Case', img: 'https://placehold.co/400x400/f8f8f8/333?text=Xbox+Case', price: '1,800', rating: '5.00' },
  { name: 'Airpods Pro 2 ANC with Ice Cream Case', img: 'https://placehold.co/400x400/f8f8f8/333?text=IceCream+Case', price: '1,800', rating: '4.75' },
  { name: 'Airpods Pro 2nd Gen ANC with Robot Cover', img: 'https://placehold.co/400x400/f8f8f8/333?text=Robot+Cover', price: '1,800', rating: '4.50' },
  { name: 'Airpods Pro 2 ANC with Radio Case', img: 'https://placehold.co/400x400/f8f8f8/333?text=Radio+Case', price: '1,800', rating: '4.00' },
  { name: 'Airpods Pro 2nd Gen ANC with Starbucks Case', img: 'https://placehold.co/400x400/f8f8f8/333?text=Starbucks+Case', price: '1,800', rating: '4.00' },
];

function createProductCard(p) {
  const ratingNum = parseFloat(p.rating);
  const fullStars = Math.floor(ratingNum);
  const starsStr = '★'.repeat(fullStars) + (ratingNum % 1 >= 0.5 ? '★' : '☆').repeat(0) + '☆'.repeat(5 - fullStars - (ratingNum % 1 >= 0.5 ? 0 : 0));
  const stars5 = '★'.repeat(Math.round(ratingNum)) + '☆'.repeat(5 - Math.round(ratingNum));

  return `<div class="product-card fade-in">
    <div class="product-img">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      <img src="${p.img}" alt="${p.name}" loading="lazy"/>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <div class="product-rating"><div class="stars">${stars5}</div><span>${p.rating}</span></div>
      <div class="product-price"><span class="price-now">₹${p.price}</span></div>
      <button class="btn btn-black btn-sm">Buy Now</button>
    </div>
  </div>`;
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
