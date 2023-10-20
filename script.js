const wrapper = document.querySelector(".wrapper");
const searchInput = wrapper.querySelector("input");
const synonyms = wrapper.querySelector(".synonyms .list");
const infoText = wrapper.querySelector(".info-text");
const volumeIcon = wrapper.querySelector(".word i");
const removeIcon = wrapper.querySelector(".search span");
let audio;

function displayWordDetails(word, phonetics, definitions, synonymsList) {
    // Mostrar la sección de detalles de la palabra.
    wrapper.classList.add("active");

    // Actualizar el contenido de la sección de detalles de la palabra.
    const wordContainer = document.querySelector('.word');
    wordContainer.querySelector('p').innerText = word;
    wordContainer.querySelector('span').innerText = phonetics;

    document.querySelector('.meaning span').innerText = definitions.definition;
    document.querySelector('.example span').innerText = definitions.example;

    // Crear un objeto de audio para la pronunciación.
    audio = new Audio('https:' + phonetics.audio);

    // Mostrar hasta 5 sinónimos.
    if (synonymsList.length === 0) {
        synonyms.parentElement.style.display = 'none';
    } else {
        synonyms.parentElement.style.display = 'block';
        synonyms.innerHTML = "";
        for (let i = 0; i < Math.min(5, synonymsList.length); i++) {
            const tag = `<span onclick="search('${synonymsList[i]}')">${synonymsList[i]},</span>`;
            synonyms.insertAdjacentHTML('beforeend', tag);
        }
    }
}

function displayError(word) {
    // Mostrar un mensaje de error cuando no se encuentra la palabra.
    infoText.innerHTML = `No se puede encontrar el significado de <span>"${word}"</span>. Por favor, intenta buscar otra palabra`;
}

function search(word) {
    // Establecer la palabra en el campo de búsqueda y realizar una búsqueda.
    searchInput.value = word;
    fetchApi(word);
}

function fetchApi(word) {
    // Ocultar la sección de detalles y mostrar un mensaje de búsqueda.
    wrapper.classList.remove('active');
    infoText.style.color = '#000';
    infoText.innerHTML = `Buscando el significado de <span>"${word}"</span>`;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then((res) => res.json())
        .then((result) => {
            if (result.title) {
                // Mostrar un mensaje de error si la palabra no se encuentra.
                displayError(word);
            } else {
                const firstResult = result[0];
                const { word, phonetics, meanings } = firstResult;
                const [meaning] = meanings;
                displayWordDetails(word, phonetics[0], meaning.definitions[0], meaning.synonyms || []);
            }
        })
        .catch(() => {
            // Manejar errores de red.
            infoText.innerHTML = 'Se produjo un error al buscar datos. Por favor, inténtalo de nuevo más tarde.';
        });
}

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value) {
        // Iniciar una búsqueda cuando se presiona la tecla Enter.
        fetchApi(e.target.value);
    }
});

volumeIcon.addEventListener('click', () => {
    if (audio) {
        // Reproducir la pronunciación de la palabra si está disponible.
        audio.play();
    }
});

removeIcon.addEventListener('click', () => {
    // Limpiar el campo de búsqueda y restablecer la interfaz.
    searchInput.value = '';
    searchInput.focus();
    wrapper.classList.remove('active');
    infoText.style.color = '#9a9a9a';
    infoText.innerHTML = 'Escribe una palabra y presiona Enter';
});
