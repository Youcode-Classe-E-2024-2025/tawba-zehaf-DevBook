document.getElementById('book-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const status = document.getElementById('status').value;
  
    const bookItem = document.createElement('div');
    bookItem.textContent = `${title} par ${author} - [${status}]`;
    
    document.getElementById('book-list').appendChild(bookItem);
  
    this.reset();
  });
  