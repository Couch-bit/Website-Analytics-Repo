// Basic mobile nav toggle
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');
hamburger?.addEventListener('click', () => nav.classList.toggle('open'));

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

// Form logic
const form = document.getElementById('purchaseForm');
form?.addEventListener('input', (e) => {
  window.dataLayer.push({
    'event': 'form_start'
  })
});
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  const consent = document.getElementById('consent');

  if (!fullName.value.trim() || !phone.value.trim() || !consent.checked) {
    alert('Please fill the required fields and accept the data processing clause.');
    window.dataLayer.push({
      'event': 'form_error'
    })
    return;
  }

  // Disable the form if a lead was generated
  const elements = form?.elements;
  for (let i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
  }
  window.dataLayer.push({
      'event': 'generate_lead'
    })
  alert('Thanks! Your request has been saved.');
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

// Disable the GDPR Banner if consent is present
if (!ask_consent) {
  document.getElementById('cookie-banner').style.display = 'none';
}

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

// Handle click events
function trackEvent(eventName, product) {
    window.dataLayer.push({
        'event': eventName,
        'product': product
})};
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-track]');
    if (target) {
        const eventName = target.getAttribute('data-info');
        const product = target.getAttribute('data-product');
        
        trackEvent(eventName, product);
    }
});
