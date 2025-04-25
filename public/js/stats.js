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
}document.addEventListener('DOMContentLoaded', () => {
  const monthInput = document.getElementById('month');
  const topBooksList = document.getElementById('top-books');
  const lateBooksList = document.getElementById('late-books');
  const topCategory = document.getElementById('top-category');
  const totalBorrows = document.getElementById('total-borrows');
  const activeUsers = document.getElementById('active-users');

  // Fonction pour afficher les statistiques
  async function displayStats() {
    try {
      // Top 10 livres
      const topBooks = await fetch('/stats/top-books?month=' + monthInput.value)
        .then(res => res.json());
      
      topBooksList.innerHTML = topBooks.map(book => `
        <li>
          <span class="font-medium">${book.book.titre}</span>
          <span class="ml-2 text-gray-600">(${book.count} emprunts)</span>
        </li>
      `).join('');

      // Livres en retard
      const lateBooks = await fetch('/stats/late-books')
        .then(res => res.json());
      
      lateBooksList.innerHTML = lateBooks.map(book => `
        <li>
          <span class="font-medium">${book.book.titre}</span>
          <span class="ml-2 text-red-600">(${book.daysLate} jours de retard)</span>
        </li>
      `).join('');

      // Catégorie la plus empruntée
      const topCat = await fetch('/stats/top-category')
        .then(res => res.json());
      
      topCategory.innerHTML = `
        <span class="font-medium">${topCat.category.nom}</span>
        <span class="ml-2 text-gray-600">(${topCat.count} emprunts)</span>
      `;

      // Totaux
      const totals = await fetch('/stats/totals')
        .then(res => res.json());
      
      totalBorrows.textContent = `📦 Emprunts : ${totals.totalBorrows}`;
      activeUsers.textContent = `👥 Utilisateurs actifs : ${totals.activeUsers}`;
    } catch (error) {
      console.error('Error fetching stats:', error);
      alert('Erreur lors du chargement des statistiques');
    }
  }

  // Mettre à jour les stats quand le mois change
  monthInput.addEventListener('change', displayStats);

  // Charger les stats au chargement de la page
  displayStats();
});

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
