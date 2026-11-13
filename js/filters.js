export function initFilters({ getCards, searchInput, filterButtons, resultCount, clearButton }) {
  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const cards = getCards();
    let visible = 0;

    cards.forEach((card) => {
      const matchesType = activeFilter === 'all' || card.dataset.type === activeFilter;
      const haystack = `${card.dataset.search || ''} ${card.textContent || ''}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const show = matchesType && matchesQuery;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });

    let empty = document.querySelector('.empty-state');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = '<strong>No memes in this postcode.</strong><span>Try another search or clear the filters.</span>';
        document.querySelector('#masonry-grid').append(empty);
      }
    } else if (empty) {
      empty.remove();
    }

    resultCount.textContent = query || activeFilter !== 'all'
      ? `${visible} ${visible === 1 ? 'POST' : 'POSTS'} FOUND`
      : `${visible} POSTS · FRESH FROM THE DISTRICT`;
    clearButton.hidden = !query && activeFilter === 'all';
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);
  clearButton.addEventListener('click', () => {
    activeFilter = 'all';
    searchInput.value = '';
    filterButtons.forEach((button) => {
      const selected = button.dataset.filter === 'all';
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    applyFilters();
    searchInput.focus();
  });

  return { applyFilters };
}
