const userList = document.getElementById("user-list");
const userBorrows = document.getElementById("user-borrows");
const apiUrl = "/users";

document.getElementById("add-user-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom: name, email })
  });

  e.target.reset();
  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch(apiUrl);
  const users = await res.json();

  userList.innerHTML = "";
  for (const user of users) {
    const count = await getBorrowCount(user.id);
    userList.innerHTML += `
      <tr>
        <td>${user.nom}</td>
        <td>${user.email}</td>
        <td>${count}</td>
        <td>
          <button onclick="deleteUser(${user.id})">❌</button>
          <button onclick="showBorrows(${user.id})">👁️</button>
        </td>
      </tr>
    `;
  }
}

async function getBorrowCount(userId) {
  const res = await fetch(`/borrows/count-by-user/${userId}`);
  const data = await res.json();
  return data.count || 0;
}

async function deleteUser(userId) {
  if (confirm("Supprimer cet utilisateur ?")) {
    await fetch(`${apiUrl}/${userId}`, { method: "DELETE" });
    fetchUsers();
  }
}

async function showBorrows(userId) {
  const res = await fetch(`/borrows/by-user/${userId}`);
  const books = await res.json();

  userBorrows.innerHTML = books.map(b => `<li>${b.titre} (${b.date_emprunt})</li>`).join("");
}

fetchUsers();
