export function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

export function initInteractions({ posts, getCards }) {
  const dialog = document.querySelector('#preview-dialog');
  const previewArt = document.querySelector('#preview-art');
  const previewTitle = document.querySelector('#preview-title');
  const previewDescription = document.querySelector('#preview-description');
  const previewCategory = document.querySelector('#preview-category');
  const previewShare = document.querySelector('#preview-share');
  let currentPost = null;

  function openPreview(post, card) {
    currentPost = post;
    document.querySelectorAll('#masonry-grid audio, #masonry-grid video').forEach((media) => media.pause());
    const visual = card.querySelector('.post-visual');
    previewArt.replaceChildren(visual.cloneNode(true));
    previewTitle.textContent = post.title;
    previewDescription.textContent = post.description;
    previewCategory.textContent = post.category;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('dialog-open');
  }

  function stopPreviewMedia() {
    dialog.querySelectorAll('audio, video').forEach((media) => {
      media.pause();
      try { media.currentTime = 0; } catch { /* Ignore media elements that have not loaded metadata. */ }
    });
  }

  function closePreview() {
    stopPreviewMedia();
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    document.body.classList.remove('dialog-open');
  }

  async function sharePost(post) {
    const shareData = { title: `MEME DISTRICT — ${post.title}`, text: post.description, url: `${location.href.split('#')[0]}#${post.id}` };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied. Send it to the group chat.');
      } else {
        showToast('Sharing is not available in this browser.');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') showToast('Could not share this post right now.');
    }
  }

  document.querySelector('#masonry-grid').addEventListener('click', (event) => {
    const card = event.target.closest('.post-card');
    if (!card) return;
    const post = posts.find((item) => item.id === card.dataset.id);
    if (!post) return;

    if (event.target.closest('[data-like]')) {
      const button = event.target.closest('[data-like]');
      const liked = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!liked));
      button.classList.toggle('is-liked', !liked);
      button.textContent = liked ? '♡ Like' : '♥ Liked';
      showToast(liked ? 'Like removed.' : 'You have excellent taste.');
      return;
    }
    if (event.target.closest('[data-preview]')) {
      openPreview(post, card);
      return;
    }
    if (event.target.closest('[data-share]')) sharePost(post);
  });

  document.querySelector('.dialog-close').addEventListener('click', closePreview);
  document.querySelector('.dialog-dismiss').addEventListener('click', closePreview);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closePreview(); });
  dialog.addEventListener('close', () => { stopPreviewMedia(); document.body.classList.remove('dialog-open'); });
  previewShare.addEventListener('click', () => { if (currentPost) sharePost(currentPost); });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !expanded);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }));

  document.querySelector('#surprise-button').addEventListener('click', () => {
    const cards = getCards().filter((card) => !card.classList.contains('is-hidden'));
    if (!cards.length) {
      document.querySelector('#clear-filters').click();
      return;
    }
    const chosen = cards[Math.floor(Math.random() * cards.length)];
    chosen.scrollIntoView({ behavior: 'smooth', block: 'center' });
    chosen.classList.remove('spotlight');
    requestAnimationFrame(() => chosen.classList.add('spotlight'));
    showToast('The district has chosen your next laugh.');
  });

  document.querySelectorAll('[data-trend]').forEach((link) => link.addEventListener('click', () => {
    const targetFilter = link.dataset.trend;
    const button = document.querySelector(`[data-filter="${targetFilter}"]`);
    if (button) button.click();
  }));

  document.querySelector('#feed-search').addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.currentTarget.value = '';
      event.currentTarget.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      document.querySelector('#feed-search').focus();
    }
  });

  // Keep the page quiet: only one audio/video element may play at a time.
  document.addEventListener('play', (event) => {
    if (!(event.target instanceof HTMLMediaElement)) return;
    document.querySelectorAll('audio, video').forEach((media) => {
      if (media !== event.target) media.pause();
    });
  }, true);

  // Escape also closes the mobile navigation when it is open.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }
  });


  // Mood check is deliberately local-only; no account or server is involved.
  const moodResult = document.querySelector('#mood-result');
  document.querySelectorAll('[data-mood]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-mood]').forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      const mood = button.dataset.mood;
      if (moodResult) moodResult.textContent = `Mood recorded for this visit: ${mood}. The District understands.`;
    });
  });

  // Tiny in-browser meme maker. It exports a PNG locally; no content is uploaded.
  const makerForm = document.querySelector('#meme-maker-form');
  if (makerForm) {
    const topInput = document.querySelector('#meme-top-text');
    const bottomInput = document.querySelector('#meme-bottom-text');
    const styleInput = document.querySelector('#meme-style');
    const topPreview = document.querySelector('#meme-preview-top');
    const bottomPreview = document.querySelector('#meme-preview-bottom');
    const preview = document.querySelector('#maker-preview');
    const themes = {
      lime: { bg: '#d4fa62', fg: '#171a10', accent: '#ff815c' },
      lilac: { bg: '#c5b4ff', fg: '#211a35', accent: '#ffffff' },
      orange: { bg: '#ff815c', fg: '#281710', accent: '#ffe4a8' },
      paper: { bg: '#f0ead9', fg: '#20241c', accent: '#94a66c' }
    };
    const updateMaker = () => {
      topPreview.textContent = topInput.value.trim() || 'YOUR TOP LINE';
      bottomPreview.textContent = bottomInput.value.trim() || 'YOUR PUNCHLINE';
      preview.dataset.theme = styleInput.value;
    };
    [topInput, bottomInput, styleInput].forEach((input) => input.addEventListener('input', updateMaker));
    styleInput.addEventListener('change', updateMaker);
    makerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const theme = themes[styleInput.value] || themes.lime;
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) { showToast('Your browser could not create the meme image.'); return; }
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = theme.accent;
      ctx.beginPath(); ctx.arc(1010, 180, 95, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = theme.fg;
      ctx.font = '800 28px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('MEME DISTRICT', 76, 82);
      ctx.textAlign = 'right';
      ctx.fillText('YOUR EDITION / 001', 1124, 82);
      function drawWrapped(text, y, fontSize, maxWidth, lineHeight) {
        ctx.font = `900 ${fontSize}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        const words = text.toUpperCase().split(/\s+/).filter(Boolean);
        const lines = [];
        let line = '';
        for (const word of words) {
          const candidate = line ? `${line} ${word}` : word;
          if (ctx.measureText(candidate).width > maxWidth && line) { lines.push(line); line = word; }
          else line = candidate;
        }
        if (line) lines.push(line);
        const usableSize = Math.min(fontSize, lines.length > 2 ? 68 : 86);
        ctx.font = `900 ${usableSize}px Arial, sans-serif`;
        lines.slice(0, 3).forEach((item, index) => ctx.fillText(item, 600, y + index * lineHeight, maxWidth));
      }
      drawWrapped(topInput.value.trim() || 'YOUR TOP LINE', 300, 86, 1010, 94);
      ctx.textAlign = 'center';
      ctx.font = '150px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.fillText('🫠', 600, 700);
      drawWrapped(bottomInput.value.trim() || 'YOUR PUNCHLINE', 890, 82, 1010, 94);
      ctx.fillStyle = theme.fg;
      ctx.globalAlpha = .65;
      ctx.font = '700 22px Arial, sans-serif';
      ctx.textAlign = 'left'; ctx.fillText('CREATED IN THE DISTRICT', 76, 1120);
      ctx.textAlign = 'right'; ctx.fillText('✳', 1124, 1120);
      ctx.globalAlpha = 1;
      const link = document.createElement('a');
      link.download = 'meme-district-custom-meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Your meme is ready. Send it to the group chat.');
    });
    updateMaker();
  }

  document.querySelector('#current-year').textContent = String(new Date().getFullYear());
}
