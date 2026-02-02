// Basic mobile nav toggle
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');
hamburger?.addEventListener('click', () => nav.classList.toggle('open'));

// Smooth scroll for all .btn-buy to #contact and record selected product
const buyButtons = document.querySelectorAll('.btn-buy');
const chosenProductInput = document.getElementById('chosenProduct');
buyButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const product = btn.getAttribute('data-product') || 'General';
    if (chosenProductInput) chosenProductInput.value = product;
  });
});

// Simple carousel
const track = document.getElementById('carousel-track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsWrap = document.getElementById('dots');
let index = 0;

function updateCarousel(i) {
  const slides = track.children;
  const total = slides.length;
  index = (i + total) % total;
  track.style.transform = `translateX(-${index * 100}%)`;
  // dots
  Array.from(dotsWrap.children).forEach((d, di) => {
    d.classList.toggle('active', di === index);
  });
}

function buildDots() {
  const total = track.children.length;
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i+1}`);
    dot.addEventListener('click', () => updateCarousel(i));
    dotsWrap.appendChild(dot);
  }
  if (dotsWrap.firstChild) dotsWrap.firstChild.classList.add('active');
}
buildDots();
prevBtn?.addEventListener('click', () => updateCarousel(index - 1));
nextBtn?.addEventListener('click', () => updateCarousel(index + 1));
setInterval(() => updateCarousel(index + 1), 6000);

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Measurement helpers
const storageKey = 'animeBoyLP:submissions';
const clickKey = 'animeBoyLP:clicks';

function saveLocal(key, data) {
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push(data);
  localStorage.setItem(key, JSON.stringify(arr));
}

// Track CTA clicks
document.querySelectorAll('a.btn, button.btn').forEach(el => {
  el.addEventListener('click', () => {
    saveLocal(clickKey, {
      ts: new Date().toISOString(),
      path: location.pathname,
      text: (el.textContent || '').trim(),
      product: el.getAttribute('data-product') || null,
      section: el.closest('section')?.id || 'header'
    });
  });
});

// Form logic
const form = document.getElementById('purchaseForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  const consent = document.getElementById('consent');

  if (!fullName.value.trim() || !phone.value.trim() || !consent.checked) {
    alert('Please fill the required fields and accept the data processing clause.');
    return;
  }

  const payload = {
    ts: new Date().toISOString(),
    product: document.getElementById('chosenProduct')?.value || 'General',
    fullName: fullName.value.trim(),
    phone: phone.value.trim(),
    message: document.getElementById('message')?.value.trim() || '',
    utm_source: new URLSearchParams(location.search).get('utm_source'),
    utm_campaign: new URLSearchParams(location.search).get('utm_campaign'),
    path: location.pathname,
    userAgent: navigator.userAgent
  };

  saveLocal(storageKey, payload);
  console.log('Submission saved locally under', storageKey, payload);
  form.reset();
  alert('Thanks! Your demo request has been saved locally.');
});

// Smooth scroll for anchor links (including Buy buttons navigating to form)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Handle GDPR Banner
document.getElementById('btn-accept').addEventListener('click', function() {
    // Hide the Banner
    document.getElementById('cookie-banner').style.display = 'none';
    
    // Send the signal to GTM
    const consent = {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
    };
    gtag('consent', 'update', consent);
    localStorage.setItem('consentMode', JSON.stringify(consent));
    document.getElementById('cookie-banner').style.display = 'none';
});
document.getElementById('btn-deny').addEventListener('click', function() {
    // Hide the Banner
    document.getElementById('cookie-banner').style.display = 'none';
});
