"use strict";

import { fetchFakerData } from './functions.js';
import { saveVote, getVotes } from './firebase.js';
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

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

let clickCount = 0; // Contador global

// Función para habilitar el formulario y manejar el envío
function enableForm() {
  const form = document.getElementById('form_voting');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    clickCount++; // Incrementa el contador en cada click

    const select = document.getElementById('select_product');
    if (!select) return;

    const productID = select.value;
    const result = await saveVote(productID);
    alert(result.message);
    form.reset();

    // Mostrar los votos y el contador de clicks
    displayVotes();
  });
}

// Función para mostrar los resultados de la votación
async function displayVotes() {
  const resultsDiv = document.getElementById('results');
  if (!resultsDiv) return;

  // Limpia el contenido mientras carga
  resultsDiv.innerHTML = `<p class="text-gray-500 text-center mt-16">Cargando resultados...</p>`;

  let votes;
  try {
    votes = await getVotes();
  } catch (error) {
    resultsDiv.innerHTML = `<p class="text-red-500 text-center mt-16">Error al obtener los votos.</p>`;
    return;
  }

  // Inicializa el conteo de todos los productos en 0
  const counts = { product1: 0, product2: 0, product3: 0 };

  if (votes) {
    Object.values(votes).forEach(vote => {
      if (vote.productID && counts.hasOwnProperty(vote.productID)) {
        counts[vote.productID]++;
      }
    });
  }

  // Crear filas para la tabla
  let rows = '';
  Object.entries(counts).forEach(([product, total]) => {
    rows += `<tr class="border-b">
      <td class="py-2 px-4 text-center">${product.replace('product', 'Producto ')}</td>
      <td class="py-2 px-4 text-center">${total}</td>
    </tr>`;
  });

  // Construir la tabla y mostrar el contador de clicks
  resultsDiv.innerHTML = `
    <h3 class="text-lg font-semibold mb-2">Resultados de la votación</h3>
    <div class="mb-2 text-blue-700 font-bold">Clicks en VOTAR: ${clickCount}</div>
    <table class="min-w-full text-sm text-gray-700 border">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">Producto</th>
          <th class="py-2 px-4 border-b">Total de votos</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// Inicializa todo al cargar la página
(() => {
  showToast();
  showVideo();
  loadData();
  enableForm();
  displayVotes();
})();
