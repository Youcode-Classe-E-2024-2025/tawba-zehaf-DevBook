document.addEventListener('DOMContentLoaded', () => {
  const categoryList = document.getElementById('category-list');
  const addCategoryForm = document.getElementById('add-category-form');
  const categoryNameInput = document.getElementById('category-name');

  // Fonction pour afficher les catégories
  async function displayCategories() {
    try {
      const response = await fetch('/categories');
      const categories = await response.json();

      // Construire la liste des catégories
      categoryList.innerHTML = categories.map(category => {
        return `
          <tr class="hover:bg-gray-50">
            <td class="p-2">${category.nom}</td>
            <td class="p-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ${category.livres_count || 0}
              </span>
            </td>
            <td class="p-2">
              <button onclick="editCategory(${category.id})" 
                      class="text-yellow-600 hover:text-yellow-800 px-2 py-1 rounded hover:bg-yellow-100">
                ✏️ Modifier
              </button>
              <button onclick="deleteCategory(${category.id})" 
                      class="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100 ml-2">
                🗑️ Supprimer
              </button>
            </td>
          </tr>
        `;
      }).join('');
    } catch (error) {
      console.error('Error fetching categories:', error);
      categoryList.innerHTML = '<tr><td colspan="3" class="text-center py-4">Erreur lors du chargement des catégories</td></tr>';
    }
  }

  // Fonction pour ajouter une catégorie
  addCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = categoryNameInput.value.trim();
    if (!name) {
      alert('Veuillez entrer un nom de catégorie');
      return;
    }

    try {
      const response = await fetch('/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom: name })
      });

      if (response.ok) {
        categoryNameInput.value = '';
        displayCategories();
        alert('Catégorie ajoutée avec succès');
      } else {
        alert('Erreur lors de l\'ajout de la catégorie');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Erreur lors de l\'ajout de la catégorie');
    }
  });

  // Fonction pour modifier une catégorie
  async function editCategory(categoryId) {
    try {
      const response = await fetch(`/categories/${categoryId}`);
      const category = await response.json();

      // Afficher le formulaire de modification
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full';
      modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Modifier la catégorie</h3>
            <div class="mt-2 px-4 py-3">
              <form id="edit-category-form">
                <input type="hidden" name="id" value="${categoryId}">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" name="nom" value="${category.nom}" 
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
      modal.querySelector('#edit-category-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
          const response = await fetch(`/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
          });

          if (response.ok) {
            modal.remove();
            displayCategories();
            alert('Catégorie modifiée avec succès');
          } else {
            alert('Erreur lors de la modification de la catégorie');
          }
        } catch (error) {
          console.error('Error updating category:', error);
          alert('Erreur lors de la modification de la catégorie');
        }
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      alert('Erreur lors de la récupération des informations de la catégorie');
    }
  }

  // Fonction pour supprimer une catégorie
  async function deleteCategory(categoryId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        const response = await fetch(`/categories/${categoryId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          displayCategories();
          alert('Catégorie supprimée avec succès');
        } else {
          alert('Erreur lors de la suppression de la catégorie');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Erreur lors de la suppression de la catégorie');
      }
    }
  }

  // Charger les catégories au chargement de la page
  displayCategories();
});
