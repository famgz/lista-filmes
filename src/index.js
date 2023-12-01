const filmsDataPath = '../assets/data/films-data.json'
let lastFilmIndex = 0
let filmsList
let filmsGrid = document.querySelector('.films-grid')


const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    // 'Referer': url,
    // 'Origin': url,
});


const requestOptions = {
    method: 'GET',
    headers: headers,
    credentials: "same-origin",
    mode: "no-cors"
};


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Home Page


function shuffleObject(obj) {
    // Convert object properties into an array of [key, value] pairs
    const entries = Object.entries(obj);
    // Shuffle the array
    const shuffledEntries = shuffleArray(entries);
    // Reconstruct the object
    const shuffledObject = Object.fromEntries(shuffledEntries);
    return shuffledObject;
}


function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function getFilmsList() {
    fetch(filmsDataPath, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        })
        .then(jsonData => {
            // console.log(jsonData)
            filmsList = shuffleObject(jsonData)
            // localStorage.setItem('filmsList', JSON.stringify(filmsList))
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error)
            alert(`Erro ao requisitar dados do endereço ${filmsDataPath}\nCaso esteja acessando um arquivo local execute o browser via localhost\nOu verifique sua conexão com a internet`
            )
        })
}


async function buildFilmCards(maxEntries = 12) {
    while (!filmsList) {
        await sleep(200)
        // console.log('waiting filmsList')
    }

    // console.log(filmsList)

    const slugs = Object.keys(filmsList);

    const tempLastFilmIndex = lastFilmIndex
    for (let i = tempLastFilmIndex; i < tempLastFilmIndex + maxEntries; i++) {
        const slug = slugs[i];
        const filmData = filmsList[slug];

        console.log(i + 1, slug, filmData.year);
        await insertFilmCard(slug, filmData)

        lastFilmIndex++
    }
    console.log('lastindex', lastFilmIndex)
}


async function insertFilmCard(slug, filmData) {

    while (!filmsGrid) {
        await sleep(200)
        filmsGrid = document.querySelector('.films-grid')
        // console.log('waiting filmgrid')
    }

    // console.log(filmsGrid)

    posterUrl = filmData.posterUrl
    // saveImage(posterUrl)

    card = `
    <a class="film-card" href="../pages/film.html?slug=${slug}">
        <img src="${posterUrl}" alt="${filmData.internationalTitle} poster image" class="card-poster-image"> 
        <div class="film-card-info">
            <h2>${filmData.internationalTitle}</h2>
            <span class='film-rating'>${'★'.repeat(filmData.rating)}</span>
            <p>${filmData.director}</p>
            <p>${filmData.countries ? filmData.countries : 'Europa'}, ${filmData.year}</p>
        </div>
    </a>
    `

    filmsGrid.insertAdjacentHTML('beforeend', card)
}


function saveImage(slug, posterUrl) {

    const downloadPoster = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                a.click();
            })
            .catch(error => console.error('Error downloading poster:', error));
    };

    if (!posterUrl) {
        console.log(`Empty posterUrl`)
        return
    }

    const filename = `${slug}.jpg`
    downloadPoster(posterUrl, filename);
}


// Film Page

// Mostrar Detalhes do Filme
async function showFilm(slug = null, filmWrapper = null) {

    filmWrapper = filmWrapper ?? null
    let filmCover
    let filmInfo

    while (!(filmWrapper && filmCover && filmInfo)) {
        await sleep(200)
        filmWrapper = document.querySelector('.film-wrapper')
        filmCover = document.querySelector('.film-cover')
        filmInfo = document.querySelector('.film-info')
        console.log('waiting film-divs')
    }

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    slug = slug ?? urlParams.get('slug')

    while (!(filmsList)) {
        // list = localStorage.getItem('filmsList');
        await sleep(200)
        console.log('waiting filmsList')
    }

    console.log(slug)
    filmData = filmsList[slug]
    console.log(filmData)

    posterUrlRetina = filmData.posterUrl.replace('/uploads/', '__retina/uploads/')

    // console.log(posterUrlRetina)

    filmCover.insertAdjacentHTML(
        'beforeend',
        `<img src="${posterUrlRetina}" alt="" class="poster-image-retina">`
    )

    filmInfoContent = `
        <h1>
            ${filmData.internationalTitle}
            <span> ${filmData.originalTitle ? '(' + filmData.originalTitle + ')' : ''}</span>
        </h1>
        <h2 class="film-rating">${'★'.repeat(filmData.rating)}</h2>
        <h2>${filmData.director}, ${filmData.year}</h2>
        <h2>${filmData.countries}</h2>
        <h2>${filmData.duration} minutos</h2>
        <p>${filmData.synopsis}</p>
    `

    filmInfo.insertAdjacentHTML('beforeend', filmInfoContent)
}


// Highlight Page

// Mostrar os Destaques
async function showHighlights(n = 3) {

    let homeWrapper

    // Wait for wrapper tag to be ready
    while (!(homeWrapper)) {
        await sleep(200)
        homeWrapper = document.querySelector('.home-wrapper')
        console.log('waiting home-wrapper')
    }

    // Wait for filmsList to be ready
    while (!(filmsList)) {
        // list = localStorage.getItem('filmsList');
        await sleep(200)
        console.log('waiting filmsList')
    }

    wrapper = `
        <div class="film-wrapper">
            <div class="container">
                <div class="film-info">
                </div>
                <div class="film-cover">
                </div>
            </div>
        </div>
    `

    // Build film wrappers
    for (let i = 0; i < n; i++) {
        homeWrapper.insertAdjacentHTML('beforeend', wrapper)
    }

    let filmWrappers = document.querySelectorAll('.film-wrapper')

    // Fill film wrappers
    for (const i in filmWrappers) {
        slug = Object.keys(filmsList)[i]
        filmWrapper = filmWrappers[i]
        console.log(slug, filmWrapper)
        await showFilm(slug, filmWrapper)
    }
}