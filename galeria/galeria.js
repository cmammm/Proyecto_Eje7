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


// 1.cargar fotos en Galería
(async () => {
    // todos los archivos del bucket
    const { data: files, error } = await supabasePublicClient.storage
        .from(BUCKET_NAME)
        .list();

    if (error) {
        console.error("Error al listar las fotos:", error);
        galeria.innerHTML = "<p>No se pudieron cargar las imágenes.</p>";
        return;
    }


    console.log("Archivos recibidos de Supabase:", files); 
    


    // ya no usamos "fotos", iteramos sobre los "files"
    for (const file of files) {
        // solo procesa archivos de imagen
        if (file.name === '.emptyFolderPlaceholder') continue;

        // obtener la URL pública para el archivo específico
        const { data } = supabasePublicClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(file.name); // Usamos file.name del objeto retornado

        const imageUrl = data.publicUrl;

        // crear miniatura
        const imgThumb = document.createElement("img");
        imgThumb.src = imageUrl;
        galeria.appendChild(imgThumb);

        // crear imagen para animación
        const imgSlide = document.createElement("img");
        imgSlide.src = imageUrl;
        slideshow.appendChild(imgSlide);

        images.push(imgSlide);
    }
    
    // asegurarse de que haya al menos una imagen antes de intentar añadir la clase 'active'
    if (images.length > 0) {
        // Poner primera activa
        images[0].classList.add("active");
    }

})();


// 2. animación - video

playBtn.addEventListener("click", () => {
    // Asegurarse de que haya imágenes para animar
    if (images.length === 0) return;
    
    animationLayer.style.display = "flex";

    index = 0;
    images.forEach(img => img.classList.remove("active"));
    images[0].classList.add("active");

    // Animación más rápida (cada 1 segundo)
    interval = setInterval(() => {
        images[index].classList.remove("active");
        index = (index + 1) % images.length;
        images[index].classList.add("active");
    }, 500); // medio segundo por imagen
});

// Cierra el overlay dando click afuera (opcional)
animationLayer.addEventListener("click", () => {
    animationLayer.style.display = "none";
    clearInterval(interval);
});

