"use strict";

/**
 * Muestra la notificación toast si existe el elemento con el ID 'toast-interactive'.
 * @returns {void}
 */
const showToast = () => {
  const toast = document.getElementById("toast-interactive");
  if (toast) {
    toast.classList.add("md:block");
  }
};

/**
 * Agrega un evento click al botón con ID 'demo' para abrir un video de YouTube en una nueva pestaña.
 * @returns {void}
 */
const showVideo = () => {
  const demoBtn = document.getElementById("demo");
  if (demoBtn) {
    demoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    });
  }
};

(() => {
  showToast();
  showVideo();
})();
