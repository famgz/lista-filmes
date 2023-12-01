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
            filmsList = jsonData
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
    saveImage(posterUrl)

    card = `
    <div class="film-card">
        <img src="${posterUrl}" alt="${filmData.internationalTitle} poster image" > 
        <p>${filmData.internationalTitle}</p>
    </div>
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