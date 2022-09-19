// call category api
const loadCategory = async () => {
    const url = 'https://openapi.programming-hero.com/api/news/categories';
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.news_category;
    } catch (error) {
        console.log(error);
    }
};
// display category
const categoryDisplay = async () => {
    const data = await loadCategory();
    data.forEach((category) => {
        let categorySection = document.getElementById('categorySide');
        const createCategory = document.createElement('div');
        createCategory.innerHTML = `
        <div class="d-grid gap-2 mb-1">
            <button id="btnn" onClick="loadNews(${category.category_id})" class="border-0 rounded px-3 py-1 gray fw-semibold fs-5" type="button">${category.category_name}</button>
        </div>
        `;
        categorySection.appendChild(createCategory);
    });
};

// load data after click category button

// call news api
const loadNews = async (category_id) => {
    // Spinner start
    toggleSpinner(true);

    const response = await fetch(
        `https://openapi.programming-hero.com/api/news/category/0${category_id}`,
    );
    const newses = await response.json();
    const newsesData = newses.data;

    const newsFound = document.getElementById('findNews');
    newsFound.innerHTML = '';
    const newsFoundText = document.createElement('div');
    if (newsesData.length > 0) {
        newsFoundText.innerHTML = `<h5 id="findNews" class="">${newsesData.length} items found in this category</h5>`;
        newsFound.appendChild(newsFoundText);
    } else {
        newsFoundText.innerHTML = `<h5 id="findNews" class="">Sorry No items found in this category</h5>`;
        newsFound.appendChild(newsFoundText);
    }
    return displayNews(newsesData);
};

// display news after click a category.
const displayNews = async (newsesData) => {
    // sort array by total_view
    let x = newsesData.sort((a, b) => (b.total_view > a.total_view ? 1 : -1));

    const newsSection = document.getElementById('newsSection');
    newsSection.innerHTML = '';

    newsesData.forEach((news) => {
        const {
            title,
            _id,
            details,
            author,
            total_view,
            rating,
            thumbnail_url,
        } = news;

        const createSingleNews = document.createElement('div');
        createSingleNews.innerHTML = `
        <div class="card mb-3">
            <div class="row g-0 align-items-center">
                <div class="col-md-3">
                    <img src="${thumbnail_url}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-9">
                    <div class="card-body pb-0">
                        <h5 class="card-title text-center text-md-start">${title}</h5>
                        <p class="pb-5">${
                            details.length > 300
                                ? details.slice(0, 300) + '...'
                                : details
                        }</p>


                        <div class="row align-items-center">
                            <div class="col d-flex col-4">
                            
                            <img width="40px" height="40px" src="${
                                author.img
                            }" class="news-author-img rounded-circle"/>
                            <p class="ms-3">Name: ${
                                author.name
                                    ? news.author.name
                                    : 'Name not found'
                            } <br />
                                <span class="text-success news-author-published">Published: ${
                                    author.published_date
                                        ? author.published_date
                                        : 'Not Found'
                                }</span>
                            </p>

                            </div>
                            <div class="col">
                           
                            <span class="fw-bolder"><i class="fa-regular fa-eye"></i> ${
                                total_view ? total_view : 'N/A'
                            }</span>

                            </div>
                            <div class="col">
                          
                            <span class="fw-bolder"><i class="fa-sharp fa-solid fa-star"></i> ${
                                rating.number ? rating.number : 'N/A'
                            }</span>

                            </div>
                            <div class="col">
                          
                            <a class="p-5" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick='newsDetailsLoad("${_id}")'><svg height="25px" width="35px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 arrow">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                          </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        newsSection.appendChild(createSingleNews);
    });
    // Spinner start
    toggleSpinner(false);
};

// Spinner
const toggleSpinner = (isLoading) => {
    const spinner = document.getElementById('spinner');
    if (isLoading) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
};

// load newsDetails api
const newsDetailsLoad = async (id) => {
    const response = await fetch(
        `https://openapi.programming-hero.com/api/news/${id}`,
    );
    const newsData = await response.json();
    displayNewsDetails(newsData.data);
};

// display news details using a modal
const displayNewsDetails = (newsData) => {
    // console.log(newsData)
    const { image_url, details, title } = newsData[0];
    const modalContainer = document.getElementById('news-details-modal');
    modalContainer.innerHTML = '';
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = `
    <div class="modal-header bg-success text-white text-justify">
    <p class="modal-title" id="exampleModalLabel">${title}</p>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
    <img src="${image_url}" class="img-fluid d-block" alt="...">
        <span>${
            details.length > 500 ? details.slice(0, 500) + '...' : details
        }</span>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-success" data-bs-dismiss="modal">Close</button>
    </div>
    `;
    modalContainer.appendChild(modalDiv);
};

categoryDisplay();
