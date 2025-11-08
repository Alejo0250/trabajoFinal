// inicio.js
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    console.log("Vas a:", e.target.textContent);
  });
});