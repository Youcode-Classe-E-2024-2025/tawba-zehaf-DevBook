document.getElementById('book-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const status = document.getElementById('status').value;

  // Show on UI immediately
  const bookItem = document.createElement('div');
  bookItem.textContent = `${title} par ${author} - [${status}]`;
  document.getElementById('book-list').appendChild(bookItem);
  
  // Send to backend API
  try {
    const response = await fetch('/books', {
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
    
    if (!response.ok) {
      throw new Error('Failed to save book');
    }
    
    console.log('Book saved successfully!');
  } catch (error) {
    console.error('Error saving book:', error);
  }
  
  this.reset();
});