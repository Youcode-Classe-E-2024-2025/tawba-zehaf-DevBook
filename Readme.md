# 📚 DevBook — Technical Book Manager for Developers

DevBook is a full-stack web application that allows developers to manage their personal library of technical books. Whether it’s books on programming, design, or architecture, DevBook helps you track your reading progress, categorize your collection, and analyze your data dynamically.

---

## 🚀 Features

- ✅ **Add / Edit / Delete** technical books
- 🗂️ Organize books by **categories** (e.g., JavaScript, DevOps, UI/UX)
- 📊 Track **reading status**: "To Read", "Reading", "Finished"
- 🔍 **Search**, **sort**, and **filter** books dynamically
- 📄 **Pagination** for large book lists
- 🔗 Built with vanilla **JavaScript**, **SQL**, and **Node.js** (no frameworks)
- 🎯 Uses **Object-Oriented Programming** for entities like `Book`, `User`, `Category`, and `Borrow`
- 🧠 Includes **UML diagrams**: Use Case and Class diagrams
- 📅 SQL Queries for analytics: late returns, top 10 borrowed, etc.

---

## 🧱 Tech Stack

- **Front-end**: HTML5, CSS3, JavaScript (DOM manipulation, events, OOP)
- **Back-end**: Node.js (vanilla), Express (optional), MySQL
- **Database**: MySQL (with foreign keys, relationships, and test data)
- **Tools**: phpMyAdmin / MySQL CLI for DB management
- **Version Control**: Git + GitHub
- **UML**: Use case + class diagrams (draw.io or similar)

---

## 🗃️ Database Schema

The database includes the following main tables:

- `books (id, title, author, status, category_id)`
- `users (id, name, email)`
- `categories (id, name)`
- `borrows (id, user_id, book_id, borrow_date, return_date, due_date)`
## Project Structure

devbook/
├── index.html
├── style.css
├── app.js         # Front-end logic (DOM, forms, pagination)
├── classes/
│   ├── Book.js
│   ├── User.js
│   ├── Category.js
│   └── Borrow.js
├── server/
│   ├── server.js  # Node.js backend server
│   └── routes/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── uml/
│   ├── use_case_diagram.png
│   └── class_diagram.png
└── README.md
