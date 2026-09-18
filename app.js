// ===== Material You 部落格：互動邏輯 =====

(function () {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const meta = document.querySelector('meta[name="theme-color"]');

  const THEME_KEY = 'blog-theme';
  const THEME_COLORS = { light: '#FFFBFE', dark: '#1C1B1F' };

  /* ---- 主題：優先讀取使用者手動選擇，其次跟隨系統 ---- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }

  initTheme();
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  /* ---- 分類 chips 篩選 ---- */
  const chips = Array.from(document.querySelectorAll('.chip'));
  const posts = Array.from(document.querySelectorAll('.post'));

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('selected'); });
      chip.classList.add('selected');

      const label = chip.textContent.trim();
      posts.forEach(function (post) {
        const tag = post.querySelector('.post-tag');
        const match = label === '全部' || (tag && tag.textContent.trim() === label);
        post.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---- 波紋回饋（Material 觸感） ---- */
  /* 底部導航不套波紋：避免 span 撐動 fixed 佈局造成跳動 */
  const rippleTargets = document.querySelectorAll('.btn, .chip, .icon-btn');
  rippleTargets.forEach(function (el) {
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
    el.style.overflow = 'hidden';
    el.addEventListener('pointerdown', function (e) {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(span);
      span.addEventListener('animationend', function () { span.remove(); });
    });
  });

  /* ---- 底部導航：斷開 focus 捲動，避免 fixed bar 往上跳 ---- */
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(function (item) {
    item.addEventListener('pointerdown', function (e) {
      e.preventDefault();
    });
    item.addEventListener('click', function (e) {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      navItems.forEach(function (n) { n.classList.remove('active'); });
      item.classList.add('active');
    });
  });

})();
