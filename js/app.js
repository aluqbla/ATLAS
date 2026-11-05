// ATLAS v0.0.6 · Fase 1.5: navegación compatible con file:// y GitHub Pages.
const APP_VERSION = '0.0.11';
document.documentElement.dataset.atlasVersion = APP_VERSION;

const tabs = [...document.querySelectorAll('.atlas-tab[role="tab"]')];
const views = new Map([...document.querySelectorAll('.atlas-view[role="tabpanel"]')].map(view => [view.id, view]));

function showTab(tab, focus = false) {
  if (!tab || !views.has(tab.getAttribute('aria-controls'))) return;
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    views.get(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}

for (const tab of tabs) {
  tab.addEventListener('click', () => showTab(tab));
  tab.addEventListener('keydown', event => {
    const index = tabs.indexOf(tab);
    let target = null;
    if (event.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
    if (event.key === 'ArrowLeft') target = tabs[(index + tabs.length - 1) % tabs.length];
    if (event.key === 'Home') target = tabs[0];
    if (event.key === 'End') target = tabs[tabs.length - 1];
    if (target) {
      event.preventDefault();
      showTab(target, true);
    }
  });
}
