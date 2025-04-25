document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const sortBy = document.getElementById('sort-by');
    const sortOrder = document.getElementById('sort-order');
    const bookList = document.getElementById('book-list');
    const paginationContainer = document.getElementById('pagination');
  
    let currentPage = 1;
    let totalPages = 1;
    let totalBooks = 0;
  
    // Fonction pour afficher les livres
    async function displayBooks() {
      const query = searchInput.value;
      const sort = sortBy.value;
      const order = sortOrder.value;
  
      try {
        const response = await fetch(`/books?query=${encodeURIComponent(query)}&page=${currentPage}&sort=${sort}&order=${order}`);
        const data = await response.json();
  
        // Mettre à jour les données de pagination
        totalBooks = data.pagination.total;
        totalPages = data.pagination.totalPages;
  
        // Construire la liste des livres
        bookList.innerHTML = data.books.map(book => `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">${book.titre}</td>
            <td class="px-6 py-4 whitespace-nowrap">${book.auteur}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                book.statut === 'à lire' ? 'bg-blue-100 text-blue-800' :
                book.statut === 'en cours' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }">
                ${book.statut}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${book.categorie.nom}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button onclick="editBook(${book.id})" class="text-indigo-600 hover:text-indigo-900">Modifier</button>
              <button onclick="deleteBook(${book.id})" class="ml-2 text-red-600 hover:text-red-900">Supprimer</button>
            </td>
          </tr>
        `).join('');
  
        // Mettre à jour la pagination
        updatePagination();
      } catch (error) {
        console.error('Error fetching books:', error);
        bookList.innerHTML = '<tr><td colspan="5" class="text-center py-4">Erreur lors du chargement des livres</td></tr>';
      }
    }
  
    // Fonction pour mettre à jour la pagination
    function updatePagination() {
      paginationContainer.innerHTML = '';
  
      if (totalPages <= 1) return;
  
      const pages = [];
      const maxVisiblePages = 5;
      const halfVisible = Math.floor(maxVisiblePages / 2);
  
      if (totalPages <= maxVisiblePages) {
        pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
      } else {
        if (currentPage <= halfVisible + 2) {
          pages.push(...Array.from({ length: maxVisiblePages - 1 }, (_, i) => i + 1));
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - halfVisible - 1) {
          pages.push(1);
          pages.push('...');
          pages.push(...Array.from({ length: maxVisiblePages - 1 }, (_, i) => totalPages - (maxVisiblePages - 2) + i));
        } else {
          pages.push(1);
          pages.push('...');
          pages.push(...Array.from({ length: maxVisiblePages - 3 }, (_, i) => currentPage - 1 + i));
          pages.push('...');
          pages.push(totalPages);
        }
      }
  
      pages.forEach(page => {
        const button = document.createElement('button');
        button.className = `px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
          page === currentPage ? 'bg-blue-500 text-white' : ''
        }`;
        
        if (page === '...') {
          button.textContent = '...';
          button.disabled = true;
        } else {
          button.textContent = page;
          button.onclick = () => {
            currentPage = page;
            displayBooks();
          };
        }
  
        paginationContainer.appendChild(button);
      });
    }
  
    // Écouteurs d'événements
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      displayBooks();
    });
  
    sortBy.addEventListener('change', displayBooks);
    sortOrder.addEventListener('change', displayBooks);
  
    // Formulaire d'ajout
    document.getElementById('book-form').addEventListener('submit', async function(e) {
      e.preventDefault();
  
      const title = document.getElementById('title').value;
      const author = document.getElementById('author').value;
      const status = document.getElementById('status').value;
  
      try {
        await fetch('/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titre: title,
            auteur: author,
            statut: status
          })
        });
  
        this.reset();
        currentPage = 1;
        displayBooks();
      } catch (error) {
        console.error('Error adding book:', error);
        alert('Erreur lors de l\'ajout du livre');
      }
    });
  
    // Charger les livres au chargement de la page
    displayBooks();
  });