// Vérification de l'âge : réglages et script partagés.
//
// La fenêtre fonctionne SANS React : tout est géré par le petit script ci-dessous,
// placé dans le <head> de chaque page. Ainsi, le bouton « J'ai 18 ans ou plus »
// répond immédiatement, même si le JavaScript du site est lent à charger ou
// échoue. La réponse est mémorisée un an dans un cookie technique (aucun suivi),
// doublé d'une copie dans le stockage local du navigateur, au cas où le cookie
// serait refusé.

export const AGE_COOKIE = "cda_age";
export const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const script = `
(function () {
  var KEY = "${AGE_COOKIE}";
  var d = document, html = d.documentElement;

  function answered() {
    try { if (/(?:^|;\\s*)${AGE_COOKIE}=1(?:;|$)/.test(d.cookie)) return true; } catch (e) {}
    try { return window.localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function isOpen() { return html.getAttribute("data-age-gate") === "open"; }
  function visible(el) { return !!(el && el.getClientRects().length); }
  function gate() {
    var all = d.querySelectorAll("[data-age-gate-root]");
    for (var i = 0; i < all.length; i++) if (visible(all[i].querySelector("[role=dialog]"))) return all[i];
    return all[0] || null;
  }
  function site(g) {
    var s = g && g.previousElementSibling;
    return s && s.id === "site" ? s : null;
  }

  // 1. Avant le premier affichage : ouvrir la fenêtre si le visiteur n'a pas encore répondu.
  if (!answered()) html.setAttribute("data-age-gate", "open");

  // 2. Dès que la page est construite : bloquer le site en dessous et placer le focus.
  function init() {
    if (!isOpen()) return;
    var g = gate(), s = site(g);
    var stale = d.querySelectorAll("#site[inert]");
    for (var i = 0; i < stale.length; i++) if (stale[i] !== s) stale[i].removeAttribute("inert");
    if (s) s.setAttribute("inert", "");
    var b = g && g.querySelector("[data-age-confirm]");
    if (b) b.focus();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();

  // 2 bis. Changement de langue : Next.js reconstruit la balise <html> et efface
  // l'attribut. Tant que le visiteur n'a pas répondu, on rouvre la fenêtre.
  try {
    new MutationObserver(function () {
      if (!answered() && !isOpen()) {
        html.setAttribute("data-age-gate", "open");
        setTimeout(init, 50);
      }
    }).observe(html, { attributes: true });
  } catch (e) {}

  // 3. Les deux boutons.
  d.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("[data-age-confirm],[data-age-deny]") : null;
    if (!t) return;
    e.preventDefault();
    var g = t.closest("[data-age-gate-root]");
    if (t.hasAttribute("data-age-confirm")) {
      try {
        d.cookie = KEY + "=1; Max-Age=${AGE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
      } catch (err) {}
      try { window.localStorage.setItem(KEY, "1"); } catch (err) {}
      html.removeAttribute("data-age-gate");
      var all = d.querySelectorAll("#site[inert]");
      for (var i = 0; i < all.length; i++) all[i].removeAttribute("inert");
    } else if (g) {
      var actions = g.querySelector("[data-age-actions]"), denied = g.querySelector("[data-age-denied]");
      if (actions) actions.hidden = true;
      if (denied) denied.hidden = false;
      // Refus : on quitte le site (message affiché le temps de la redirection).
      window.location.replace("https://www.google.com");
    }
  }, true);

  // 4. Clavier : le focus reste dans la fenêtre tant qu'elle est ouverte.
  d.addEventListener("keydown", function (e) {
    if (e.key !== "Tab" || !isOpen()) return;
    var g = gate(); if (!g) return;
    var f = [].filter.call(g.querySelectorAll("a[href], button"), visible);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (f.indexOf(d.activeElement) === -1) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
`;

/** Script minifié simplement (espaces en trop retirés), injecté dans le <head>. */
export const ageGateScript = script.replace(/\n\s*\/\/[^\n]*/g, "").replace(/\s*\n\s*/g, " ").trim();
