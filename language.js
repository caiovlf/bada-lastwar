"use strict";
// A new browser session starts in English; navigation keeps an explicit choice.
window.BADA_LANGUAGE = (() => {
  const supported = ['en','pt','es','ko','vi','de'];
  const key = 'bada-language-session';
  return {
    get() { try { const value = sessionStorage.getItem(key); return supported.includes(value) ? value : 'en'; } catch { return 'en'; } },
    set(value) { if (supported.includes(value)) { try { sessionStorage.setItem(key,value); } catch {} } }
  };
})();
