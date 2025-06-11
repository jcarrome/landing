"use strict";

import { fetchFakerData } from './functions.js';
import { saveVote, getVotes } from './firebase.js';

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
 * Habilita el formulario de votación y envía los datos a Firebase.
 */
const enableForm = () => {
  const form = document.getElementById('form_voting');
  const select = document.getElementById('select_product');
  if (!form || !select) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = select.value;
    if (!value) return;

    // Guardar voto en Firebase
    const result = await saveVote(value);

    // Mostrar mensaje de éxito o error
    alert(result.message);

    // Limpiar formulario
    form.reset();

    // Actualizar la tabla de resultados
    displayVotes();
  });
};

/**
 * Obtiene los votos de Firebase y los muestra en una tabla.
 */
const displayVotes = async () => {
  const results = document.getElementById('results');
  if (!results) return;

  const response = await getVotes();
  if (!response.success) {
    results.innerHTML = `<p class="text-red-500 text-center mt-16">${response.message}</p>`;
    return;
  }

  const votes = response.data || {};
  // Contar votos por producto
  const counts = { product1: 0, product2: 0, product3: 0 };
  Object.values(votes).forEach(vote => {
    if (vote.product && counts.hasOwnProperty(vote.product)) {
      counts[vote.product]++;
    }
  });
  const total = counts.product1 + counts.product2 + counts.product3;

  // Crear tabla
  results.innerHTML = `
    <h3 class="text-lg font-semibold mb-2 text-gray-700">Resultados:</h3>
    <table class="min-w-full text-center">
      <thead>
        <tr>
          <th class="px-4 py-2">Producto</th>
          <th class="px-4 py-2">Votos</th>
          <th class="px-4 py-2">Porcentaje</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Producto 1</td>
          <td>${counts.product1}</td>
          <td>${total ? ((counts.product1/total)*100).toFixed(1) : 0}%</td>
        </tr>
        <tr>
          <td>Producto 2</td>
          <td>${counts.product2}</td>
          <td>${total ? ((counts.product2/total)*100).toFixed(1) : 0}%</td>
        </tr>
        <tr>
          <td>Producto 3</td>
          <td>${counts.product3}</td>
          <td>${total ? ((counts.product3/total)*100).toFixed(1) : 0}%</td>
        </tr>
      </tbody>
    </table>
    <p class="mt-4 text-sm text-gray-500">Total de votos: ${total}</p>
  `;
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
  enableForm();
  displayVotes();
})();

/*
Explicación de la interacción JS-UI y envío de datos a Firebase:
El formulario HTML es gestionado por JavaScript, que captura el evento submit, obtiene el valor seleccionado y llama a saveVote para guardar el voto en Firebase. Luego, se actualiza la tabla de resultados llamando a displayVotes, que obtiene los votos desde Firebase y los muestra en la interfaz.
*/

