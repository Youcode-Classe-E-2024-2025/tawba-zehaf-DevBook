document.addEventListener('DOMContentLoaded', () => {
  const borrowList = document.getElementById('borrow-list');

  // Fonction pour afficher les emprunts
  async function displayBorrows() {
    try {
      const response = await fetch('/emprunts');
      const borrows = await response.json();

      // Construire la liste des emprunts
      borrowList.innerHTML = borrows.map(borrow => {
        const deadline = new Date(borrow.date_echeance);
        const now = new Date();
        const isLate = !borrow.rendu && deadline < now;
        const statusText = borrow.rendu ? "✅ Rendu" : isLate ? "🔴 En retard" : "🕓 En cours";
        const statusClass = borrow.rendu ? "bg-green-100 text-green-800" : isLate ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";

        return `
          <tr class="hover:bg-gray-50 ${isLate ? 'bg-red-50' : ''}">
            <td class="px-4 py-2">${borrow.livre.titre}</td>
            <td class="px-4 py-2">${borrow.utilisateur.nom}</td>
            <td class="px-4 py-2">${borrow.date_emprunt}</td>
            <td class="px-4 py-2">${borrow.date_echeance}</td>
            <td class="px-4 py-2">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${statusText}
              </span>
            </td>
            <td class="px-4 py-2">
              ${!borrow.rendu ? `
                <button onclick="markReturned(${borrow.id})" 
                        class="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100">
                  📦 Rendu
                </button>
              ` : ''}
              <button onclick="editBorrow(${borrow.id})" 
                      class="text-yellow-600 hover:text-yellow-800 px-2 py-1 rounded hover:bg-yellow-100 ml-2">
                ✏️ Modifier
              </button>
              <button onclick="deleteBorrow(${borrow.id})" 
                      class="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100 ml-2">
                🗑️ Supprimer
              </button>
            </td>
          </tr>
        `;
      }).join('');
    } catch (error) {
      console.error('Error fetching borrows:', error);
      borrowList.innerHTML = '<tr><td colspan="6" class="text-center py-4">Erreur lors du chargement des emprunts</td></tr>';
    }
  }

  // Fonction pour marquer un emprunt comme rendu
  async function markReturned(borrowId) {
    try {
      const response = await fetch(`/emprunts/${borrowId}/return`, {
        method: 'PUT'
      });
      if (response.ok) {
        displayBorrows();
      } else {
        alert('Erreur lors de la mise à jour de l\'emprunt');
      }
    } catch (error) {
      console.error('Error marking borrow as returned:', error);
      alert('Erreur lors de la mise à jour de l\'emprunt');
    }
  }

  // Fonction pour modifier un emprunt
  async function editBorrow(borrowId) {
    try {
      const response = await fetch(`/emprunts/${borrowId}`);
      const borrow = await response.json();
      
      // Afficher le formulaire de modification
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full';
      modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Modifier l'emprunt</h3>
            <div class="mt-2 px-4 py-3">
              <form id="edit-borrow-form">
                <input type="hidden" name="id" value="${borrowId}">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Livre</label>
                  <select name="livre_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    ${borrow.livre_id}
                  </select>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Utilisateur</label>
                  <select name="utilisateur_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    ${borrow.utilisateur_id}
                  </select>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Date d'emprunt</label>
                  <input type="date" name="date_emprunt" value="${borrow.date_emprunt}" 
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Date d'échéance</label>
                  <input type="date" name="date_echeance" value="${borrow.date_echeance}" 
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div class="mt-4 flex justify-end space-x-3">
                  <button type="button" onclick="this.closest('.fixed').remove()" 
                          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Annuler
                  </button>
                  <button type="submit" 
                          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Gérer la soumission du formulaire
      modal.querySelector('#edit-borrow-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
          const response = await fetch(`/emprunts/${borrowId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          
          if (response.ok) {
            modal.remove();
            displayBorrows();
          } else {
            alert('Erreur lors de la modification de l\'emprunt');
          }
        } catch (error) {
          console.error('Error updating borrow:', error);
          alert('Erreur lors de la modification de l\'emprunt');
        }
      });
    } catch (error) {
      console.error('Error fetching borrow:', error);
      alert('Erreur lors de la récupération des informations de l\'emprunt');
    }
  }

  // Fonction pour supprimer un emprunt
  async function deleteBorrow(borrowId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet emprunt ?')) {
      try {
        const response = await fetch(`/emprunts/${borrowId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          displayBorrows();
        } else {
          alert('Erreur lors de la suppression de l\'emprunt');
        }
      } catch (error) {
        console.error('Error deleting borrow:', error);
        alert('Erreur lors de la suppression de l\'emprunt');
      }
    }
  }

  // Fonctions pour gérer le modal de nouvel emprunt
  function openNewBorrowModal() {
    document.getElementById('new-borrow-modal').classList.remove('hidden');
    // Charger les livres et utilisateurs disponibles
    loadBooksAndUsers();
  }

  function closeNewBorrowModal() {
    document.getElementById('new-borrow-modal').classList.add('hidden');
    document.getElementById('new-borrow-form').reset();
  }

  async function loadBooksAndUsers() {
    try {
      // Charger les livres disponibles (statut = 'disponible')
      const booksResponse = await fetch('/books?query=&sort=titre&order=ASC');
      const books = await booksResponse.json();
      
      // Charger les utilisateurs
      const usersResponse = await fetch('/users');
      const users = await usersResponse.json();

      // Mettre à jour les sélecteurs
      const bookSelect = document.querySelector('select[name="livre_id"]');
      const userSelect = document.querySelector('select[name="utilisateur_id"]');

      // Ajouter les options pour les livres
      books.books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.titre} (${book.auteur})`;
        bookSelect.appendChild(option);
      });

      // Ajouter les options pour les utilisateurs
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.nom;
        userSelect.appendChild(option);
      });

      // Mettre à jour la date d'emprunt par défaut
      const today = new Date().toISOString().split('T')[0];
      document.querySelector('input[name="date_emprunt"]').value = today;
      
      // Mettre à jour la date d'échéance par défaut (2 semaines après)
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);
      document.querySelector('input[name="date_echeance"]').value = returnDate.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error loading books and users:', error);
      alert('Erreur lors du chargement des livres et utilisateurs');
    }
  }

  // Gérer la soumission du formulaire de nouvel emprunt
  document.getElementById('new-borrow-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const borrowData = Object.fromEntries(formData);

    try {
      const response = await fetch('/emprunts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(borrowData)
      });

      if (response.ok) {
        closeNewBorrowModal();
        displayBorrows();
        alert('Emprunt créé avec succès');
      } else {
        alert('Erreur lors de la création de l\'emprunt');
      }
    } catch (error) {
      console.error('Error creating borrow:', error);
      alert('Erreur lors de la création de l\'emprunt');
    }
  });

  // Charger les emprunts au chargement de la page
  displayBorrows();
});
