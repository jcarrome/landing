"use strict";

import { fetchFakerData } from './functions.js';

/**
 * Muestra la notificación toast si existe el elemento con el ID 'toast-interactive'.
 * @function
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
 * @function
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

/**
 * Renderiza cards con los datos recibidos en el contenedor skeleton-container.
 * Itera sobre los tres primeros elementos del arreglo y muestra sus datos en tarjetas.
 * @function
 * @param {Array<Object>} items - Arreglo de objetos con las claves title, author, genre y content.
 * @returns {void}
 */
const renderCards = (items) => {
  const container = document.getElementById("skeleton-container");
  if (!container) return;

  const cards = items.slice(0, 3).map(item => `
    <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
      <div class="h-40 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg text-2xl font-bold text-gray-500 dark:text-gray-400">
        ${item.genre}
      </div>
      <div class="text-xl font-semibold text-gray-900 dark:text-white truncate">${item.title}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Por ${item.author}</div>
      <div class="text-gray-700 dark:text-gray-300 text-base">${item.content}</div>
    </div>
  `).join("");

  container.innerHTML = cards;
};

/**
 * Carga datos desde la API de Faker y los muestra en tarjetas.
 * Llama a fetchFakerData y procesa la respuesta.
 * @async
 * @function
 * @returns {Promise<void>}
 */
const loadData = async () => {
  const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

  try {
    const result = await fetchFakerData(url);

    if (result.success) {
      console.log('Datos obtenidos con éxito:', result.body);
      renderCards(result.body.data);
    } else {
      console.error('Error al obtener los datos:', result.error);
    }

  } catch (error) {
    console.error('Ocurrió un error inesperado:', error);
  }
};

/**
 * Función de autoejecución que inicializa la interfaz.
 * @function
 * @returns {void}
 */
(() => {
  showToast();
  showVideo();
  loadData();
})();
