document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom: name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        window.location.href = 'login.html';
      } else {
        alert(data.error || 'Erreur lors de linscription');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Erreur lors de linscription');
    }
  });
});