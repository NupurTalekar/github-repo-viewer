const API_BASE_URL = 'https://api.github.com';

let currentPage = 1;
let reposPerPage = 10;
let totalRepos = 0;

function showLoader() {
    $('#loader').show();
}

function hideLoader() {
    $('#loader').hide();
}

function renderRepos(repos) {
    const reposContainer = $('#repos-container');
    reposContainer.empty();

    repos.forEach(repo => {
        const repoElement = $('<div class="repo"></div>');
        repoElement.append(`<h3>${repo.name}</h3>`);
        repoElement.append(`<p>${repo.description || 'No description available.'}</p>`);
        repoElement.append(`<p>Language: ${repo.language || 'N/A'}</p>`);
        repoElement.append(`<img src="${repo.owner.avatar_url}" alt="Owner Avatar">`);
        reposContainer.append(repoElement);
    });
}

function renderPagination() {
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    const paginationContainer = $('#pagination-container');
    paginationContainer.empty();

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = $(`<a class="page-link">${i}</a>`);
        if (i === currentPage) {
            pageLink.addClass('active');
        }
        pageLink.click(() => {
            currentPage = i;
            fetchRepos();
        });
        paginationContainer.append(pageLink);
    }
}

function fetchRepos() {
    showLoader();

    const username = 'johnpapa'; // Replace with the desired GitHub username
    const apiUrl = `${API_BASE_URL}/users/${username}/repos?page=${currentPage}&per_page=${reposPerPage}`;

    $.get(apiUrl)
        .done(response => {
            hideLoader();
            totalRepos = response.length;
            renderRepos(response);
            renderPagination();
        })
        .fail(error => {
            hideLoader();
            console.error('Error fetching repositories:', error);
        });
}

$(document).ready(() => {
    fetchRepos();
});

