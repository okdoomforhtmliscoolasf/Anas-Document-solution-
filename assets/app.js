(() => {
  'use strict';

  const menu = document.querySelector('.menu');
  const nav = document.querySelector('header nav');

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const isOpen = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('open', !isOpen);
      menu.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Open navigation');
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.focus();
      }
    });
  }

  // A custom cursor is enabled only where a real mouse/trackpad cursor exists.
  const canUseStarCursor = window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canUseStarCursor) {
    const cursor = document.querySelector('.star-cursor') || document.createElement('div');
    cursor.className = 'star-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = '✦';
    if (!cursor.isConnected) document.body.appendChild(cursor);
    document.documentElement.classList.add('has-star-cursor');

    let moveFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (moveFrame) return;
      moveFrame = window.requestAnimationFrame(() => {
        cursor.style.left = `${pointerX}px`;
        cursor.style.top = `${pointerY}px`;
        cursor.classList.add('visible');
        moveFrame = 0;
      });
    }, { passive: true });

    document.addEventListener('pointerout', event => {
      if (!event.relatedTarget) cursor.classList.remove('visible');
    });
    document.addEventListener('pointerover', event => {
      if (event.target.closest('a, button, input, textarea, select, label')) cursor.classList.add('hovering');
      else cursor.classList.remove('hovering');
    });
    document.addEventListener('pointerdown', () => cursor.classList.add('hovering'));
    document.addEventListener('pointerup', () => cursor.classList.remove('hovering'));
  }

  // Split the homepage wordmark into individually animated characters when present.
  document.querySelectorAll('.wordmark').forEach(element => {
    const text = element.textContent || '';
    element.replaceChildren();
    [...text].forEach(character => {
      const span = document.createElement('span');
      span.textContent = character === ' ' ? '\u00a0' : character;
      element.appendChild(span);
    });
  });

  // Progressive reveal; content stays visible if IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('in'));
  }

  // Service search and category filters.
  const search = document.querySelector('#serviceSearch');
  const cards = [...document.querySelectorAll('.card[data-cat]')];
  const filters = [...document.querySelectorAll('.filter[data-filter]')];
  let activeCategory = 'all';

  function filterServices() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let visibleCount = 0;
    cards.forEach(card => {
      const categoryMatches = activeCategory === 'all' || card.dataset.cat === activeCategory;
      const textMatches = !query || card.textContent.toLocaleLowerCase().includes(query);
      const visible = categoryMatches && textMatches;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    const empty = document.querySelector('.empty');
    if (empty) empty.hidden = visibleCount !== 0;
  }

  if (search) search.addEventListener('input', filterServices);
  filters.forEach(button => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.filter || 'all';
      filters.forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      filterServices();
    });
  });

  // Create a correctly encoded WhatsApp message from the booking form.
  const bookingForm = document.querySelector('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;

      const formData = new FormData(bookingForm);
      const message = [
        'Hello Anas Documents Solution!',
        `Name: ${formData.get('name') || ''}`,
        `Phone: ${formData.get('phone') || ''}`,
        `Service: ${formData.get('service') || ''}`,
        `Details: ${formData.get('details') || 'Not specified'}`,
        'I would like to book a free appointment.'
      ].join('\n');

      const whatsappUrl = `https://wa.me/918652124770?text=${encodeURIComponent(message)}`;
      window.location.assign(whatsappUrl);
    });
  }

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
})();