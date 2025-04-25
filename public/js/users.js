document.addEventListener('DOMContentLoaded', () => {
  const userList = document.getElementById('user-list');
  const userBorrows = document.getElementById('user-borrows');
  const addUserForm = document.getElementById('add-user-form');
  const userNameInput = document.getElementById('user-name');
  const userEmailInput = document.getElementById('user-email');

  // Fonction pour afficher les utilisateurs
  async function displayUsers() {
    try {
      const response = await fetch('/users');
      const users = await response.json();

      userList.innerHTML = users.map(user => {
        return `
          <tr class="hover:bg-gray-50" onclick="selectUser(${user.id})">
            <td class="p-2">${user.nom}</td>
            <td class="p-2">${user.email}</td>
            <td class="p-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${user.emprunts_count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                ${user.emprunts_count || 0}
              </span>
            </td>
            <td class="p-2">
              <button onclick="editUser(${user.id})" 
                      class="text-yellow-600 hover:text-yellow-800 px-2 py-1 rounded hover:bg-yellow-100">
                ✏️ Modifier
              </button>
              <button onclick="deleteUser(${user.id})" 
                      class="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100 ml-2">
                🗑️ Supprimer
              </button>
            </td>
          </tr>
        `;
      }).join('');
    } catch (error) {
      console.error('Error fetching users:', error);
      userList.innerHTML = '<tr><td colspan="4" class="text-center py-4">Erreur lors du chargement des utilisateurs</td></tr>';
    }
  }

  // Fonction pour ajouter un utilisateur
  addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();

    if (!name || !email) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom: name, email: email })
      });

      if (response.ok) {
        userNameInput.value = '';
        userEmailInput.value = '';
        displayUsers();
        alert('Utilisateur ajouté avec succès');
      } else {
        alert('Erreur lors de l\'ajout de l\'utilisateur');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Erreur lors de l\'ajout de l\'utilisateur');
    }
  });

  // Fonction pour modifier un utilisateur
  async function editUser(userId) {
    try {
      const response = await fetch(`/users/${userId}`);
      const user = await response.json();

      // Afficher le formulaire de modification
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full';
      modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Modifier l\'utilisateur</h3>
            <div class="mt-2 px-4 py-3">
              <form id="edit-user-form">
                <input type="hidden" name="id" value="${userId}">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" name="nom" value="${user.nom}" 
                         class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" value="${user.email}" 
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
      modal.querySelector('#edit-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
          const response = await fetch(`/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
          });

          if (response.ok) {
            modal.remove();
            displayUsers();
            alert('Utilisateur modifié avec succès');
          } else {
            alert('Erreur lors de la modification de l\'utilisateur');
          }
        } catch (error) {
          console.error('Error updating user:', error);
          alert('Erreur lors de la modification de l\'utilisateur');
        }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Erreur lors de la récupération des informations de l\'utilisateur');
    }
  }

  // Fonction pour supprimer un utilisateur
  async function deleteUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const response = await fetch(`/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          displayUsers();
          alert('Utilisateur supprimé avec succès');
        } else {
          alert('Erreur lors de la suppression de l\'utilisateur');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  }

  // Fonction pour sélectionner un utilisateur et afficher ses emprunts
  async function selectUser(userId) {
    try {
      // Mettre en surbrillance la ligne sélectionnée
      const rows = document.querySelectorAll('#user-list tr');
      rows.forEach(row => row.classList.remove('bg-blue-100'));
      const selectedRow = document.querySelector(`#user-list tr[onclick*="${userId}"]`);
      selectedRow.classList.add('bg-blue-100');

      // Récupérer les emprunts de l'utilisateur
      const response = await fetch(`/users/${userId}/emprunts`);
      const borrows = await response.json();

      // Mettre à jour la liste des emprunts
      userBorrows.innerHTML = borrows.map(borrow => {
        const status = borrow.statut === 'rendu' 
          ? '<span class="text-green-600">✅ Rendu</span>'
          : borrow.statut === 'en_retard' 
            ? '<span class="text-red-600">⏰ En retard</span>'
            : '<span class="text-yellow-600">⏳ À rendre</span>';

        return `<li>
          <span class="font-medium">${borrow.livre.titre}</span>
          <span class="ml-2">${status}</span>
          <span class="text-sm text-gray-600 ml-2">(Emprunté le ${new Date(borrow.date_emprunt).toLocaleDateString()})</span>
        </li>`;
      }).join('');
    } catch (error) {
      console.error('Error fetching user borrows:', error);
      userBorrows.innerHTML = '<li class="text-red-600">Erreur lors du chargement des emprunts</li>';
    }
  }

  // Charger les utilisateurs au chargement de la page
  displayUsers();
});
