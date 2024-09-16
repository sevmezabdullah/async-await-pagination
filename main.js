const dataContainer = document.getElementById("data-container");
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
const LIMIT = 10;
let totalPages = 0;

const loadingIndicator = document.createElement('p')
loadingIndicator.textContent = "Veriler getiriliyor.."
loadingIndicator.style.display = "none"
document.body.appendChild(loadingIndicator)



async function fetchData(page, limit) {
  loadingIndicator.style.display = "block"
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
  loadingIndicator.style.display = "none"
  if (!response.ok) {
    throw new Error("Veriler getirilirken bir hata meydana geldi. Lütfen tekrar deneyiniz.");
  }


  const totalCount = response.headers.get('X-Total-Count')

  totalPages = Math.ceil(totalCount / LIMIT)
  return await response.json();
}



async function displayData() {
  try {
    const data = await fetchData(currentPage, LIMIT);
    dataContainer.innerHTML = "";
    data.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p>`;
      dataContainer.appendChild(card);
    })


    pageInfo.textContent = `Bulunduğunuz sayfa ${currentPage} Toplam Sayfa Sayısı ${totalPages}`
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    document.getElementById('pagination').innerHTML = ""
    createPageSelector()

  } catch (error) {
    console.info(`Hata: ${error}`);
  }
}


function createPageSelector() {
  const pageSelector = document.getElementById('page-selector');
  if (pageSelector) pageSelector.remove();


  const select = document.createElement('select');

  for (let i = 1; i <= totalPages; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
    if (i === currentPage) option.selected = true
  }


  select.addEventListener('change', () => {
    currentPage = parseInt(select.value);
    displayData();
  })


  document.getElementById('pagination').appendChild(select);



}

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayData();
  }
})

nextButton.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayData();
  }
})

displayData()