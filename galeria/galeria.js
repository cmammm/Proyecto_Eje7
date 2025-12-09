const supabasePublicClient = supabase.createClient(
    'https://tqtcyphinjsqxuadxtwj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGN5cGhpbmpzcXh1YWR4dHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDE0MzUsImV4cCI6MjA3NzQ3NzQzNX0.MlgyjJM67TvOaDnL0V_As3IpZ8EkoofQBNa8jrEkp3E'
);

const BUCKET_NAME = "fotos";

const galeria = document.getElementById("galeria");
const slideshow = document.getElementById("slideshow");
const animationLayer = document.getElementById("animationLayer");
const playBtn = document.getElementById("playBtn");

let images = [];
let index = 0;
let interval;


// 1. CARGAR FOTOS
(async () => {
    const { data: files, error } = await supabasePublicClient
        .storage
        .from(BUCKET_NAME)
        .list();

    if (error) {
        console.error("Error al listar las fotos:", error);
        galeria.innerHTML = "<p>No se pudieron cargar las imágenes.</p>";
        return;
    }

    for (const file of files) {
        if (file.name === ".emptyFolderPlaceholder") continue;

        const { data } = supabasePublicClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(file.name);

        const imageUrl = data.publicUrl;

        // MINIATURA
        const imgThumb = document.createElement("img");
        imgThumb.src = imageUrl;
        galeria.appendChild(imgThumb);

        // CLICK PARA VERLA EN GRANDE
        imgThumb.addEventListener("click", () => {
            showSingleImage(imageUrl);
        });

        // Imagen para ANIMACIÓN
        const imgSlide = document.createElement("img");
        imgSlide.src = imageUrl;
        slideshow.appendChild(imgSlide);

        images.push(imgSlide);
    }

    if (images.length > 0) {
        images[0].classList.add("active");
    }
})();


// 2. ANIMACIÓN SLIDESHOW

playBtn.addEventListener("click", () => {
    if (images.length === 0) return;

    playBtn.style.display = "none";  
    animationLayer.style.display = "flex";

    index = 0;
    images.forEach(img => img.classList.remove("active"));
    images[0].classList.add("active");

    interval = setInterval(() => {
        images[index].classList.remove("active");
        index = (index + 1) % images.length;
        images[index].classList.add("active");
    }, 500);
});


// Cerrar animación
animationLayer.addEventListener("click", () => {
    animationLayer.style.display = "none";
    playBtn.style.display = "block";
    clearInterval(interval);
});


// 3. VER UNA FOTO EN GRANDE

function showSingleImage(url) {
    animationLayer.style.display = "flex";
    playBtn.style.display = "none";

    clearInterval(interval);

    slideshow.innerHTML = ""; 
    const img = document.createElement("img");
    img.src = url;
    img.classList.add("active");

    slideshow.appendChild(img);
}
