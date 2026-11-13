import { posts } from './content.js';
import { initFilters } from './filters.js';
import { initInteractions } from './interactions.js';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function visualMarkup(post, index) {
  if (post.imageUrl) {
    return `<div class="post-visual photo-meme-visual">
      <img class="photo-meme-image" src="${escapeHtml(post.imageUrl)}" alt="${escapeHtml(post.imageAlt || post.title)}" loading="lazy" decoding="async">
      <span class="photo-meme-tag">${escapeHtml(post.imageTag || 'DISTRICT SNAPSHOT')}</span>
      <div class="photo-meme-copy"><span>${escapeHtml(post.imageTop || '')}</span><strong>${escapeHtml(post.imageBottom || post.title)}</strong></div>
      <a class="photo-meme-credit" href="${escapeHtml(post.imageSource)}" target="_blank" rel="noopener noreferrer" aria-label="Photo credit: ${escapeHtml(post.imageCredit || 'Pexels')}">PHOTO: ${escapeHtml(post.imageCredit || 'PEXELS')}</a>
    </div>`;
  }
  if (post.type === 'video') {
    return `<div class="post-visual video-visual">
      <video class="inline-video" controls preload="none" playsinline aria-label="${escapeHtml(post.title)}">
        <source src="${escapeHtml(post.videoUrl)}" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>
      <a class="video-credit" href="${escapeHtml(post.videoSource)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(post.videoCredit)}">ⓘ PEXELS CREDIT</a>
      <span class="video-note">SHORT CLIP · STREAMS ONLINE</span>
      <a class="video-fallback" href="${escapeHtml(post.videoSource)}" target="_blank" rel="noopener noreferrer">Stream unavailable? Open on Pexels ↗</a>
    </div>`;
  }
  if (post.type === 'audio') {
    return `<div class="post-visual audio-visual">
      <span class="audio-title">${escapeHtml(post.audioLabel)}</span>
      <div class="audio-bars" aria-hidden="true">${[18,34,25,44,29,16,38,47,26,36,19,42,30,15,34,45,23,37,17,29].map((height) => `<i style="--bar-height:${height}px"></i>`).join('')}</div>
      <audio class="audio-player" controls preload="none" aria-label="Play ${escapeHtml(post.title)}">
        <source src="${escapeHtml(post.audioUrl)}" type="${escapeHtml(post.audioType || 'audio/wav')}">
        Your browser does not support audio playback.
      </audio>
      <span class="audio-credit">ORIGINAL DISTRICT SOUND</span>
    </div>`;
  }
  const artClass = escapeHtml(post.art || 'art-lime');
  const artLabel = escapeHtml(post.category || 'DISTRICT ORIGINAL');
  return `<div class="post-visual editorial-art ${artClass}" role="img" aria-label="${escapeHtml([post.line1, post.line2, post.line3].filter(Boolean).join('. '))}">
    <span class="art-kicker">${artLabel}</span>
    <div class="art-copy"><strong>${escapeHtml(post.line1)}<br>${escapeHtml(post.line2)}</strong><span class="art-subcopy">${escapeHtml(post.line3)}</span></div>
    <span class="art-object" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="art-index" aria-hidden="true">DISTRICT ORIGINAL / ${String(index + 1).padStart(2, '0')}</span>
  </div>`;
}

function renderPost(post, index) {
  const safeTitle = escapeHtml(post.title);
  return `<article class="post-card ${escapeHtml(post.size)}" data-id="${escapeHtml(post.id)}" data-type="${escapeHtml(post.type)}" data-search="${escapeHtml(`${post.search} ${post.title} ${post.description}`)}">
    <div class="post-topline"><span class="post-category">${escapeHtml(post.category)}</span><span class="post-index">MD / ${String(index + 1).padStart(2, '0')}</span></div>
    ${visualMarkup(post, index)}
    <div class="post-caption"><h3>${safeTitle}</h3><p>${escapeHtml(post.description)}</p></div>
    <div class="post-actions"><button class="post-action" type="button" data-like aria-pressed="false">♡ Like</button><button class="post-action" type="button" data-share>↗ Share</button><button class="post-action preview-action" type="button" data-preview>View ↗</button></div>
  </article>`;
}

const grid = document.querySelector('#masonry-grid');
if (!grid) throw new Error('MEME DISTRICT could not find #masonry-grid. Check index.html.');
grid.innerHTML = posts.map(renderPost).join('');
grid.querySelectorAll('.photo-meme-image').forEach((image) => {
  image.addEventListener('error', () => image.closest('.photo-meme-visual')?.classList.add('image-failed'));
});
grid.querySelectorAll('.inline-video').forEach((video) => {
  video.addEventListener('error', () => video.closest('.video-visual')?.classList.add('has-video-error'));
});
const getCards = () => Array.from(grid.querySelectorAll('.post-card'));

initFilters({
  getCards,
  searchInput: document.querySelector('#feed-search'),
  filterButtons: Array.from(document.querySelectorAll('.filter-chip')),
  resultCount: document.querySelector('#result-count'),
  clearButton: document.querySelector('#clear-filters')
});
const total = document.querySelector('#post-total');
if (total) total.textContent = String(posts.length);
initInteractions({ posts, getCards });
