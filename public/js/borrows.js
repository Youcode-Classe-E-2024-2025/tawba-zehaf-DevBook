const borrowList = document.getElementById("borrow-list");

async function fetchBorrows() {
  const res = await fetch("/borrows");
  const borrows = await res.json();

  borrowList.innerHTML = "";

  for (const b of borrows) {
    const deadline = new Date(b.date_retour);
    const now = new Date();
    const isLate = !b.rendu && deadline < now;
    const statusText = b.rendu ? "✅ Rendu" : isLate ? "🔴 En retard" : "🕓 En cours";

    borrowList.innerHTML += `
      <tr style="background:${isLate ? '#ffe0e0' : 'white'}">
        <td>${b.livre.titre}</td>
        <td>${b.utilisateur.nom}</td>
        <td>${b.date_emprunt}</td>
        <td>${b.date_retour}</td>
        <td>${statusText}</td>
        <td>
          ${!b.rendu ? `<button onclick="markReturned(${b.id})">📦 Rendu</button>` : "-"}
        </td>
      </tr>
    `;
  }
}

async function markReturned(id) {
  await fetch(`/borrows/${id}/return`, {
    method: "PUT",
  });
  fetchBorrows();
}

fetchBorrows();
