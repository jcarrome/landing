// Importa las funciones necesarias desde el CDN de Firebase v11.9.1
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

// Función para guardar un voto en la colección "votes"
export function saveVote(productID) {
  const votesRef = ref(database, 'votes');
  const newVoteRef = push(votesRef);
  const voteData = {
    productID: productID,
    date: new Date().toISOString()
  };

  return set(newVoteRef, voteData)
    .then(() => {
      return { success: true, message: "Voto guardado correctamente." };
    })
    .catch((error) => {
      return { success: false, message: "Error al guardar el voto: " + error.message };
    });
}

// Función para obtener los votos de la colección "votes"
export async function getVotes() {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, 'votes'));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error al obtener los votos: " + error.message);
  }
}