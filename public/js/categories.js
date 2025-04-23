const categoryList = document.getElementById("category-list");
const apiUrl = "/categories";

document.getElementById("add-category-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("category-name").value;

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom: name })
  });

  e.target.reset();
  fetchCategories();
});

async function fetchCategories() {
  const res = await fetch(`${apiUrl}/with-count`);
  const categories = await res.json();

  categoryList.innerHTML = "";
  for (const cat of categories) {
    categoryList.innerHTML += `
      <tr>
        <td>${cat.nom}</td>
        <td>${cat.nb_livres || 0}</td>
        <td><button onclick="deleteCategory(${cat.id})">❌</button></td>
      </tr>
    `;
  }
}

async function deleteCategory(catId) {
  if (confirm("Supprimer cette catégorie ?")) {
    await fetch(`${apiUrl}/${catId}`, { method: "DELETE" });
    fetchCategories();
  }
}

fetchCategories();
