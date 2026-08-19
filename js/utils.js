"use strict";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);
}

function icon(name, filled = false) {
  return `<span class="material-symbols-rounded${filled ? " filled" : ""}" aria-hidden="true">${name}</span>`;
}
