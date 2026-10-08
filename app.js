(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeLabel = document.querySelector('.theme-label');
  const themeIcon = document.querySelector('.theme-icon');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const toast = document.querySelector('#toast');
  let toastTimer;

  const savedTheme = localStorage.getItem('abdullah-theme');
  if (savedTheme === 'dark') root.dataset.theme = 'dark';
  updateThemeControl();

  function updateThemeControl() {
    const dark = root.dataset.theme === 'dark';
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeLabel.textContent = dark ? 'Dark' : 'Light';
    themeIcon.textContent = dark ? '☾' : '☼';
  }

  themeToggle?.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('abdullah-theme', dark ? 'dark' : 'light');
    updateThemeControl();
  });

  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? 'Close' : 'Menu';
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = 'Menu';
  }));

  const projectCards = [...document.querySelectorAll('.project-card')];
  const projectCount = document.querySelector('#project-count');
  document.querySelectorAll('.filter-button').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      document.querySelectorAll('.filter-button').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      let visible = 0;
      projectCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (projectCount) projectCount.textContent = `SHOWING ${visible} / 14`;
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        showToast('Copied to clipboard');
      } catch {
        showToast(value);
      }
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
