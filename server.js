import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Log current directory for debugging
console.log("Current directory:", __dirname);

// Use absolute path for database (located in the 'db' folder)
const dbPath = resolve(__dirname, "db", "database.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("✅ Connected to the SQLite database at", dbPath);
  }
});

app.use(cors());
app.use(bodyParser.json());

// Create users table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    MiddleName TEXT,
    Email TEXT UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    Address TEXT,
    City TEXT,
    Telephone TEXT,
    RegisterDate DATE DEFAULT (datetime('now')),
    LastActivity DATETIME DEFAULT (datetime('now')),
    UserType INTEGER DEFAULT 1
  )
`);

// ✅ Register User (Password Not Hashed)
app.post("/register", (req, res) => {
  const { first_name, last_name, middle_name, email, password, address, city, telephone } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: "⚠️ Всички полета са задължителни!" });
  }

  const sql = `
    INSERT INTO Users (FirstName, LastName, MiddleName, Email, Password, Address, City, Telephone) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [first_name, last_name, middle_name || "", email, password, address || "", city || "", telephone || ""], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ message: "⚠️ Този имейл вече съществува!" });
      }
      return res.status(500).json({ message: "❌ Грешка в базата данни!", error: err.message });
    }
    res.status(201).json({ message: "✅ Регистрацията е успешна!", userId: this.lastID });
  });
});

// ✅ Login User (Password Not Hashed)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "⚠️ Всички полета са задължителни!" });
  }

  const sql = `SELECT * FROM Users WHERE Email = ?`;

  db.get(sql, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "❌ Грешка в базата данни!", error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: "⚠️ Невалиден имейл или парола!" });
    }

    // Compare entered password with the stored one
    if (password !== user.Password) {
      return res.status(401).json({ message: "⚠️ Невалиден имейл или парола!" });
    }

    res.status(200).json({ message: "✅ Входът е успешен!", user });
  });
});

app.get("/books", (req, res) => {
    const sql = "SELECT * FROM Books ORDER BY DateAdded DESC";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "❌ Грешка в базата данни!", error: err.message });
      }
      res.status(200).json(rows);
    });
});

app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const sql = "SELECT * FROM Books WHERE ID = ?";
    db.get(sql, [bookId], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "❌ Грешка в базата данни!", error: err.message });
      }
      if (!row) {
        return res.status(404).json({ message: "❌ Книгата не е намерена!" });
      }
      res.status(200).json(row);
    });
  });

  app.get('/special-books', (req, res) => {
    const query = `
      SELECT * FROM Books
      ORDER BY (OldPrice - Price) DESC
      LIMIT 5;
    `;
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("❌ Error fetching special books:", err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(rows);
    });
  });

  app.get('/top-visited-books', (req, res) => {
    const query = `
      SELECT * FROM Books
      ORDER BY VisitedCount DESC
      LIMIT 5;
    `;
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("❌ Error fetching top visited books:", err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(rows);
    });
  });

  app.post('/increment-visited-count/:bookId', (req, res) => {
    const { bookId } = req.params;
  
    // Assuming you are using a database like SQLite
    const query = `UPDATE Books SET VisitedCount = VisitedCount + 1 WHERE ID = ?`;
    
    db.run(query, [bookId], function (err) {
      if (err) {
        console.error("Error updating visited count:", err);
        return res.status(500).json({ success: false, message: "Failed to update visited count" });
      }
  
      // Send a success response
      return res.status(200).json({ success: true, message: "Visited count updated" });
    });
  });

  app.get('/search-books', (req, res) => {
    const { q, sort, bookStore, city } = req.query;
    
    // Start constructing the SQL query
    let query = `SELECT * FROM Books WHERE 1=1`;
    const queryParams = [];
  
    if (q) {
      query += ` AND (Name LIKE ? OR Description LIKE ?)`;
      queryParams.push(`%${q}%`, `%${q}%`);
    }
  
    if (bookStore && bookStore !== '1') {
      query += ` AND BookStore = ?`;
      queryParams.push(bookStore);
    }
  
    if (city && city !== '1') {
      query += ` AND City = ?`;
      queryParams.push(city);
    }
  
    if (sort) {
      switch (sort) {
        case 'highest_price':
          query += ` ORDER BY Price DESC`;
          break;
        case 'lowest_price':
          query += ` ORDER BY Price ASC`;
          break;
        case 'newest':
          query += ` ORDER BY DateAdded DESC`;
          break;
        case 'name':
          query += ` ORDER BY Name ASC`;
          break;
        default:
          query += ` ORDER BY DateAdded DESC`;
      }
    }
  
    console.log('Executing query:', query);  // Log the query
    console.log('With parameters:', queryParams);  // Log the parameters
  
    // Execute the query
    db.all(query, queryParams, (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Database query error' });
      }
  
      res.json(rows);
    });
});

app.post("/vote", (req, res) => {
    const { userId, bookId, vote } = req.body;
  
    if (!userId || !bookId || !vote || vote < 1 || vote > 5) {
      console.error("Invalid vote data:", req.body); // 🔹 Log invalid request data
      return res.status(400).json({ error: "Invalid vote data" });
    }
  
    db.get(
      "SELECT * FROM Votes WHERE USER_ID = ? AND BOOK_ID = ?",
      [userId, bookId],
      (err, row) => {
        if (err) {
          console.error("Error fetching existing vote:", err.message); // 🔹 Log SQL error
          return res.status(500).json({ error: err.message });
        }
  
        if (row) {
          db.run(
            "UPDATE Votes SET Vote = ? WHERE USER_ID = ? AND BOOK_ID = ?",
            [vote, userId, bookId],
            (err) => {
              if (err) {
                console.error("Error updating vote:", err.message); // 🔹 Log update error
                return res.status(500).json({ error: err.message });
              }
              res.json({ success: true, message: "Vote updated" });
            }
          );
        } else {
          db.run(
            "INSERT INTO Votes (USER_ID, BOOK_ID, Vote) VALUES (?, ?, ?)",
            [userId, bookId, vote],
            (err) => {
              if (err) {
                console.error("Error inserting vote:", err.message); // 🔹 Log insert error
                return res.status(500).json({ error: err.message });
              }
              res.json({ success: true, message: "Vote recorded" });
            }
          );
        }
      }
    );
});

// Server: Get book with highest average vote
app.get("/highest-rated-book", (req, res) => {
    const query = `
      SELECT b.ID, b.Name, b.ImagePath, b.Description, AVG(v.Vote) as AverageVote
      FROM Books b
      LEFT JOIN Votes v ON b.ID = v.BOOK_ID
      GROUP BY b.ID
      ORDER BY AverageVote DESC
      LIMIT 1;
    `;
  
    db.get(query, (err, row) => {
      if (err) {
        console.error("Error fetching highest rated book:", err);
        return res.status(500).json({ error: err.message });
      }
  
      if (!row) {
        return res.status(404).json({ message: "No books found" });
      }
  
      res.json(row); // Send the book with the highest average vote
    });
});

// Start the server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
