const search = document.querySelector('#search');
const filters = document.querySelector('#filters');
const list = document.querySelector('#lessons');
const count = document.querySelector('#count');
const dialog = document.querySelector('#lesson-dialog');
const closeDialog = document.querySelector('#close-dialog');
let activeUnit = 'Усі розділи';
const escapeHtml = value => value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function renderFilters() {
  const units = ['Усі розділи', ...new Set(lessons.map(lesson => lesson.unit))];
  filters.innerHTML = units.map(unit => `<button class="filter ${unit === activeUnit ? 'active' : ''}" type="button">${escapeHtml(unit)}</button>`).join('');
  filters.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { activeUnit = button.textContent; render(); }));
}
function render() {
  const query = search.value.trim().toLocaleLowerCase('uk');
  const shown = lessons.filter(lesson => {
    const matchesUnit = activeUnit === 'Усі розділи' || lesson.unit === activeUnit;
    return matchesUnit && Object.values(lesson).join(' ').toLocaleLowerCase('uk').includes(query);
  });
  count.textContent = shown.length;
  list.innerHTML = shown.length ? shown.map(lesson => `<article class="lesson"><div class="lesson-top"><span class="number">Урок ${lesson.n}</span><time class="date">${lesson.date}</time></div><span class="tag">${escapeHtml(lesson.unit)}</span><h3>${escapeHtml(lesson.topic)}</h3><p class="lesson-preview">${escapeHtml(lesson.result)}</p><button class="open-lesson" type="button" data-lesson="${lesson.n}">Докладніше →</button></article>`).join('') : '<p class="empty">За вашим запитом уроків не знайдено.</p>';
  list.querySelectorAll('.open-lesson').forEach(button => button.addEventListener('click', () => openLesson(Number(button.dataset.lesson))));
  renderFilters();
}
search.addEventListener('input', render);
function openLesson(number) {
  const lesson = lessons.find(item => item.n === number);
  document.querySelector('#dialog-label').textContent = `Урок ${lesson.n} · ${lesson.unit}`;
  document.querySelector('#dialog-title').textContent = lesson.topic;
  document.querySelector('#dialog-date').textContent = lesson.date;
  document.querySelector('#dialog-result').textContent = lesson.result;
  document.querySelector('#dialog-homework').textContent = lesson.homework || 'Домашнє завдання не задано.';
  dialog.showModal();
}
closeDialog.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
render();
