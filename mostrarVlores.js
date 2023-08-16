// Chave de API para autenticação com a API do The Movie Database (TMDb)
const apiKey = '';

// URL da API para obter a lista de gêneros de filmes
const genresEndpoint = 'https://api.themoviedb.org/3/genre/movie/list?language=pt-BR&api_key=' + apiKey;

// Variável para armazenar o ID do gênero selecionado pelo usuário
let selectedGenreId = '';

// Função para exibir os filmes na página

function mostrarValores(filmes) {
    // Obtém o elemento HTML onde os filmes serão exibidos
    const divFilmes = document.getElementById("filmes");

    // Mapeia a matriz de filmes para gerar o HTML de cada filme
    const filmesHTML = filmes.map(filme => {
        return `
        <div class="col">
            <body class="bg-dark text-light">
            <div class="card bg-dark text-light">
                <!-- Exibe a imagem do pôster do filme -->
                <img src="https://image.tmdb.org/t/p/w500/${filme.poster_path}" class="card-img-top" alt="${filme.title}">
                <div class="card-body">
                    <!-- Exibe o título do filme -->
                    <h5 class="card-title">${filme.title}</h5>
                    <!-- Exibe a sinopse do filme -->
                    
                    <p class="card-text limitar-linhas">${filme.overview}</p>
                </div>
            </div>
        </div>`;
    });

    // Insere o HTML dos filmes no elemento divFilmes
    divFilmes.innerHTML = `<div class="row">${filmesHTML.join("")}</div>`;
}



// Busca e preenche o menu suspenso de gêneros
fetch(genresEndpoint)
    .then(response => response.json())
    .then(data => {
        // Obtém o elemento do menu suspenso de gêneros
        const genreSelect = document.getElementById('genreSelect');

        // Preenche o menu suspenso com opções de gêneros
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });

        // Adiciona um ouvinte de evento para detectar mudanças no menu suspenso
        genreSelect.addEventListener('change', () => {
            // Atualiza o ID do gênero selecionado
            selectedGenreId = genreSelect.value;
            // Chama a função para buscar e exibir os filmes com base no gênero selecionado
            getAndDisplayMovies();
        });
    })
    .catch(error => console.error('Erro ao obter os gêneros:', error));

// URL da API para buscar filmes com base no gênero selecionado
const moviesEndpoint = 'https://api.themoviedb.org/3/discover/movie?language=pt-BR&api_key=' + apiKey;

// Função para buscar e exibir os filmes com base no gênero selecionado
function getAndDisplayMovies() {
    // Constrói a URL de busca de filmes com base no gênero selecionado
    const filteredEndpoint = selectedGenreId
        ? `${moviesEndpoint}&with_genres=${selectedGenreId}`
        : moviesEndpoint;

    // Chama a função para buscar dados da API e exibir os filmes na página
    getDadosAPI(filteredEndpoint)
        .then(filmes => mostrarValores(filmes))
        .catch(error => console.error("Erro ao obter os dados da API:", error));
}

// Função assíncrona para buscar dados da API
async function getDadosAPI(endPoint) {
    try {
        // Faz uma solicitação à API e aguarda a resposta
        const res = await fetch(endPoint);
        // Converte a resposta em formato JSON
        const data = await res.json();
        // Retorna a matriz de filmes
        const filmes = data.results;
        return filmes;
    } catch (error) {
        // Em caso de erro, lança o erro
        throw error;
    }
}

// Inicializa a busca e exibição dos filmes ao carregar a página
getAndDisplayMovies();
