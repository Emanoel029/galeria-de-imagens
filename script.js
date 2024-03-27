const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");

//Variáveis de chave de API, paginações, searchTerm
const apiKey = "q7FyW99pS83aXD37Vr8pXKuXI2LpuqLqp7Dg0TaYVARnAGIbRgr0D8E9";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  //converter a img recebida em blob, criar o seu link de descarregamento e descarregá-la
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Falha no Download da Imagem!"));
};

const showLightbox = (name, img) => {
  //Mostrar a lightbox e definir a fonte e o nome da imagem e botão attribute
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  //Criar uma lista de todas as imagens obtidas e adicioná-las ao wrapper de imagem existente
  imagesWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
      <img src="${img.src.large2x}" alt="img">
      <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
            <i class="uil uil-import"></i>
          </button>
      </div>
    </li>`
    )
    .join("");
};

const getImages = (apiURL) => {
  //Obtenção de imagens por chamada de API com cabeçalho de autorização
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("falha ao carregar imagens"));
};

const loadMoreImages = () => {
  currentPage++; //Incrementar currentPage em 1
  // se searchTerm tiver algum valor, chamar a API com o termo de pesquisa, caso contrário, chamar a API predefinida
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const loadSarchImages = (e) => {
  //se a entrada de pesquisa estiver vazia, definir o termo de pesquisa como nulo e devolver o formulário aqui
  if (e.target.value === "") return (searchTerm = null);

  //se a tecla premida for enter, actualiza a página atual, o termo de pesquisa e chama o getImages
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  } //search?query=${searchTerm}
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSarchImages); //
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
