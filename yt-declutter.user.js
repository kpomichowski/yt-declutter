// ==UserScript==
// @name         YouTube Declutter
// @namespace    https://github.com/kpomichowski/yt-declutter
// @version      1.0.0
// @description  Removes Shorts and video recommendations from YouTube
// @author       KP
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @noframes
// @updateURL    https://raw.githubusercontent.com/kpomichowski/yt-declutter/main/yt-declutter.meta.js
// @downloadURL  https://raw.githubusercontent.com/kpomichowski/yt-declutter/main/yt-declutter.user.js
// ==/UserScript==

(function () {
  "use strict";

  const DESKTOP_SELECTORS = [
    // Collapsed menu selectors
    "ytd-mini-guide-entry-renderer a[href='/shorts']",
    "ytd-mini-guide-entry-renderer a[href='/feed/subscriptions']",
    // Expanded menu selectors
    "ytd-guide-entry-renderer a[title='Shorts']",
    "ytd-guide-entry-renderer a[href='/feed/you']",
    "ytd-guide-signin-promo-renderer",
    "ytd-guide-section-renderer",
  ];

  const MOBILE_SELECTORS = [];

  function removeDOMElements(selectors) {
    selectors.forEach((selector) =>
      document.querySelectorAll(selector).forEach((el) => {
        const target =
          el.closest(
            "ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer",
          ) || el;
        target.remove();
        console.log("Removed from the HTML DOM given target:", target);
      }),
    );
  }
  document.addEventListener("DOMContentLoaded", function () {
    removeDOMElements(DESKTOP_SELECTORS);
  });
})();
