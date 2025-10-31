const introVideo = document.getElementById("intro-video");
const enlaceFinal = document.getElementById("enlace-final");

// Cuando el video termine, aparece el botón
introVideo.addEventListener("ended", () => {
  enlaceFinal.classList.add("show");
});
