const monthInput = document.getElementById("month");
const topBooksList = document.getElementById("top-books");
const lateBooksList = document.getElementById("late-books");
const topCategoryEl = document.getElementById("top-category");
const totalBorrowsEl = document.getElementById("total-borrows");
const activeUsersEl = document.getElementById("active-users");

monthInput.addEventListener("change", loadTopBooks);

async function loadTopBooks() {
  const [year, month] = monthInput.value.split("-");
  const res = await fetch(`/stats/top-books?year=${year}&month=${month}`);
  const books = await res.json();

  topBooksList.innerHTML = books.map(b => `<li>${b.titre} (${b.total} emprunts)</li>`).join("");
}

async function loadLateBooks() {
  const res = await fetch(`/stats/late-books`);
  const books = await res.json();

  lateBooksList.innerHTML = books.map(b => `<li>${b.titre} - ${b.utilisateur.nom}</li>`).join("");
}

async function loadTopCategory() {
  const res = await fetch(`/stats/top-category`);
  const cat = await res.json();
  topCategoryEl.textContent = `${cat.nom} (${cat.total} emprunts)`;
}

async function loadTotals() {
  const res = await fetch(`/stats/totals`);
  const data = await res.json();

  totalBorrowsEl.textContent = `📦 Emprunts : ${data.emprunts}`;
  activeUsersEl.textContent = `👥 Utilisateurs actifs : ${data.users}`;
}

loadLateBooks();
loadTopCategory();
loadTotals();
