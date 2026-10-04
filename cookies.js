(function () {
  const cookieName = 'syli_cookie_consent';
  const cookieLifetime = 60 * 60 * 24 * 180;
  const root = document.createElement('div');
  root.innerHTML = [
    '<aside class="cookie-banner" data-cookie-banner role="dialog" aria-label="Choix des cookies" hidden>',
    '<h2>Votre confidentialité, votre choix.</h2>',
    '<p>Un cookie technique mémorise votre préférence. Aucun outil de mesure d’audience ou de publicité n’est actif actuellement.</p>',
    '<div class="cookie-actions">',
    '<button type="button" data-cookie-reject>Tout refuser</button>',
    '<button type="button" class="cookie-preferences" data-cookie-customize>Personnaliser</button>',
    '<button type="button" class="cookie-accept" data-cookie-accept>Tout accepter</button>',
    '</div><button class="cookie-settings-link" type="button" data-cookie-open>En savoir plus et modifier mon choix</button>',
    '</aside>',
    '<div class="cookie-backdrop" data-cookie-backdrop hidden></div>',
    '<section class="cookie-modal" data-cookie-modal role="dialog" aria-modal="true" aria-labelledby="cookie-title" hidden>',
    '<div class="cookie-modal-head"><div><h2 id="cookie-title">Paramètres de confidentialité</h2>',
    '<p class="cookie-modal-intro">Ce site ne charge actuellement aucun outil d’analyse ou de publicité. Vos préférences seront respectées si des cookies facultatifs sont ajoutés ultérieurement.</p></div>',
    '<button class="cookie-close" type="button" data-cookie-close aria-label="Fermer">×</button></div>',
    '<div class="cookie-choice"><div><strong>Préférence de consentement</strong><small>Indispensable pour mémoriser votre choix pendant 6 mois.</small></div><input class="cookie-toggle" type="checkbox" checked disabled aria-label="Cookie de préférence toujours actif"></div>',
    '<div class="cookie-choice"><div><strong>Mesure d’audience</strong><small>Désactivée sur cette version. Aucun outil de mesure n’est chargé.</small></div><input class="cookie-toggle" type="checkbox" data-cookie-analytics aria-label="Autoriser la mesure d’audience"></div>',
    '<div class="cookie-modal-foot"><button class="cookie-reject" type="button" data-cookie-reject>Tout refuser</button><button type="button" data-cookie-close>Fermer</button><button class="cookie-save" type="button" data-cookie-save>Enregistrer mes choix</button></div>',
    '</section>'
  ].join('');
  document.body.appendChild(root);

  const banner = root.querySelector('[data-cookie-banner]');
  const modal = root.querySelector('[data-cookie-modal]');
  const backdrop = root.querySelector('[data-cookie-backdrop]');
  const analyticsToggle = root.querySelector('[data-cookie-analytics]');
  let returnFocus = null;

  function readConsent() {
    const item = document.cookie.split('; ').find((part) => part.indexOf(cookieName + '=') === 0);
    if (!item) return null;
    try { return JSON.parse(decodeURIComponent(item.slice(cookieName.length + 1))); }
    catch (_) { return null; }
  }

  function saveConsent(analytics) {
    const value = encodeURIComponent(JSON.stringify({ necessary: true, analytics: Boolean(analytics), date: new Date().toISOString() }));
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = cookieName + '=' + value + '; Max-Age=' + cookieLifetime + '; Path=/; SameSite=Lax' + secure;
    hideSettings();
    banner.hidden = true;
  }

  function openSettings() {
    returnFocus = document.activeElement;
    const choice = readConsent();
    analyticsToggle.checked = Boolean(choice && choice.analytics);
    banner.hidden = true;
    backdrop.hidden = false;
    modal.hidden = false;
    root.querySelector('[data-cookie-close]').focus();
  }

  function hideSettings() {
    modal.hidden = true;
    backdrop.hidden = true;
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
  }

  if (!readConsent()) banner.hidden = false;
  document.querySelectorAll('[data-cookie-open]').forEach((button) => button.addEventListener('click', openSettings));
  root.querySelectorAll('[data-cookie-customize]').forEach((button) => button.addEventListener('click', openSettings));
  root.querySelectorAll('[data-cookie-accept]').forEach((button) => button.addEventListener('click', () => saveConsent(true)));
  root.querySelectorAll('[data-cookie-reject]').forEach((button) => button.addEventListener('click', () => saveConsent(false)));
  root.querySelectorAll('[data-cookie-close]').forEach((button) => button.addEventListener('click', () => {
    hideSettings();
    if (!readConsent()) banner.hidden = false;
  }));
  root.querySelector('[data-cookie-save]').addEventListener('click', () => saveConsent(analyticsToggle.checked));
  backdrop.addEventListener('click', () => {
    hideSettings();
    if (!readConsent()) banner.hidden = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      hideSettings();
      if (!readConsent()) banner.hidden = false;
    }
  });

  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
})();
