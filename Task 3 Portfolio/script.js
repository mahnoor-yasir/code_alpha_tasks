const menu = document.getElementById("menu");
const nav = document.getElementById("nav");

menu.addEventListener("click", () => nav.classList.toggle("open"));

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const revealItems = document.querySelectorAll(".reveal");
function revealOnScroll(){
  revealItems.forEach(item => {
    if(item.getBoundingClientRect().top < window.innerHeight - 80){
      item.classList.add("visible");
    }
  });
}
window.addEventListener("load", revealOnScroll);
window.addEventListener("scroll", revealOnScroll);

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if(scrollY >= sec.offsetTop - 170) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if(link.getAttribute("href") === `#${current}`) link.classList.add("active");
  });
});

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".project-card");
filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(btn => btn.classList.remove("active"));
    filter.classList.add("active");
    const selected = filter.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle("hidden", !(selected === "all" || card.dataset.category === selected));
    });
  });
});
