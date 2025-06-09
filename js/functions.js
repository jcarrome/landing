'use strict';

export const fetchFakerData = (url) => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => ({
      success: true,
      body: data
    }))
    .catch(error => ({
      success: false,
      error: `Ocurrió un error al obtener los datos: ${error.message}`
    }));
};

