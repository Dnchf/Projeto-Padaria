
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("Modo-escuro");


  function aplicarModoEscuro() {
    const isDark = localStorage.getItem("dark-mode") === "true";
    document.body.classList.toggle("dark-mode", isDark);
    if (toggle) {
      toggle.textContent = isDark ? "☀️" : "🌙";
    }
  }


  aplicarModoEscuro();

 
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = !document.body.classList.contains("dark-mode");
      document.body.classList.toggle("dark-mode", isDark);
      toggle.textContent = isDark ? "☀️" : "🌙";


      localStorage.setItem("dark-mode", isDark);


      toggle.classList.add("rotate");
      setTimeout(() => toggle.classList.remove("rotate"), 500);
    });
  }


  window.addEventListener("storage", (event) => {
    if (event.key === "dark-mode") {
      aplicarModoEscuro();
    }
  });
});
