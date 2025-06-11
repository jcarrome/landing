// Importa las funciones necesarias del SDK de Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Configuración de Firebase usando variables de entorno de Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Obtiene la referencia a la base de datos en tiempo real
const database = getDatabase(app);

/**
 * Guarda un voto en la colección 'votes' de la base de datos.
 * @param {string} productID - El ID del producto votado.
 * @returns {Promise<Object>} - Mensaje de éxito o error.
 */
export function saveVote(productID) {
  const votesRef = ref(database, 'votes');
  const newVoteRef = push(votesRef);
  const data = {
    product: productID,
    date: new Date().toISOString()
  };
  return set(newVoteRef, data)
    .then(() => ({
      success: true,
      message: "¡Voto registrado correctamente!"
    }))
    .catch((error) => ({
      success: false,
      message: "Error al registrar el voto: " + error.message
    }));
}

/**
 * Obtiene todos los votos de la colección 'votes' de la base de datos.
 * @returns {Promise<Object>} - Objeto con los votos o error.
 */
export function getVotes() {
  const votesRef = ref(database);
  return get(child(votesRef, 'votes'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return { success: true, data: snapshot.val() };
      } else {
        return { success: true, data: {} };
      }
    })
    .catch((error) => ({
      success: false,
      message: "Error al obtener los votos: " + error.message
    }));
}

/*
Explicación CRUD con el SDK de Firebase:
- Create: Se usa push() para crear una nueva referencia y set() para guardar datos.
- Read: Se usa get() y child() para leer datos de una ruta específica.
- Update: Se puede usar update(ref, data) para modificar datos existentes.
- Delete: Se puede usar remove(ref) para eliminar datos de una ruta.
*/

/*
Explicación para obtener datos:
El SDK de Firebase permite obtener datos usando get() y child(). 
Se obtiene una referencia a la ruta deseada y se llama get(child(ref, 'ruta')), 
lo que devuelve una promesa con los datos almacenados en esa ruta.
*/