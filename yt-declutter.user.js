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
// @updateURL    https://raw.githubusercontent.com/kpomichowski/yt-declutter/refs/heads/master/yt-declutter.meta.js
// @downloadURL  https://raw.githubusercontent.com/kpomichowski/yt-declutter/refs/heads/master/yt-declutter.user.js
// ==/UserScript==

(function () {
  "use strict";
  const LOG_PREFIX = "[YouTube Declutter]";
  const DESKTOP_RULES = [
    {
      selector: "ytd-mini-guide-entry-renderer a[href='/shorts/']",
      removeTarget: "ytd-mini-guide-entry-renderer",
    },
    {
      selector: "ytd-guide-entry-renderer a[title='Shorts']",
      removeTarget: "ytd-guide-entry-renderer",
    },
    {
      selector: "ytd-guide-entry-renderer a[href='/feed/you']",
      removeTarget: "ytd-guide-entry-renderer",
    },
    {
      selector: "ytd-guide-entry-renderer a[href^='/@']",
      removeTarget: "ytd-guide-entry-renderer",
    },
    {
      selector: "ytd-video-renderer a#thumbnail[href^='/shorts/']",
      removeTarget: "ytd-video-renderer",
    },
    { selector: "#secondary" },
    { selector: "#chip-bar" },
    { selector: "grid-shelf-view-model" },
    { selector: "ytd-guide-signin-promo-renderer" },
    { selector: "ytd-rich-shelf-renderer[is-shorts]" },
    { selector: "ytd-feed-filter-chip-bar-renderer" },
    { selector: "ytd-guide-collapsible-entry-renderer #expander-item" },
  ];

  const DESKTOP_SECTION_TITLES = [
    {
      title: "Explore",
      titleSelector: "yt-formatted-string#guide-section-title",
      removeTarget: "ytd-guide-section-renderer",
    },
    {
      title: "More from YouTube",
      titleSelector: "yt-formatted-string#guide-section-title",
      removeTarget: "ytd-guide-section-renderer",
    },
  ];

  const MOBILE_RULES = [];
  const MOBILE_SECTION_TITLES = [];

  function onDomReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function removeByRules(rules) {
    rules.forEach(({ selector, removeTarget }) => {
      document.querySelectorAll(selector).forEach((element) => {
        const target = removeTarget
          ? element.closest(removeTarget) || element
          : element;
        target.remove();
        console.log(`${LOG_PREFIX} Removed:`, target);
      });
    });
  }

  function removeByTitleRules(titleRules) {
    titleRules.forEach(({ title, titleSelector, removeTarget }) => {
      document.querySelectorAll(titleSelector).forEach((element) => {
        if (element.textContent.trim().toLowerCase() === title.toLowerCase()) {
          const target = removeTarget
            ? element.closest(removeTarget) || element
            : element;
          target.remove();
          console.log(`${LOG_PREFIX} Removed:`, target);
        }
      });
    });
  }

  function removeChipBarSpacing() {
    const frostedGlass = document.querySelector("#frosted-glass.with-chipbar");
    if (frostedGlass) {
      frostedGlass.classList.remove("with-chipbar");
    }
  }

  function cleanUp() {
    const isMobile = window.location.hostname === "m.youtube.com";
    const rules = isMobile ? MOBILE_RULES : DESKTOP_RULES;
    const titleRules = isMobile
      ? MOBILE_SECTION_TITLES
      : DESKTOP_SECTION_TITLES;
    console.log(`"${LOG_PREFIX}" cleanup() called, isMobile:`, isMobile);
    console.log(`"${LOG_PREFIX}" rules count:`, rules.length);
    removeChipBarSpacing();
    removeByRules(rules);
    removeByTitleRules(titleRules);
  }

  function setUpObserver() {
    const observer = new MutationObserver(cleanUp);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  function init() {
    cleanUp();
    setUpObserver();
  }

  onDomReady(init);
})();
