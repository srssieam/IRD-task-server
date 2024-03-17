const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3001;
const db = new sqlite3.Database('dua_main.sqlite');


// middleware
app.use(cors());
app.use(express.json())


// Endpoint to list all tables in the database
app.get('/tables', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(tables);
    });
  });


// Endpoint to fetch data from all tables
app.get('/data', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      const data = {};
      let counter = 0;
  
      // Fetch data from each table
      tables.forEach(table => {
        db.all(`SELECT * FROM ${table.name}`, (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          data[table.name] = rows;
  
          // Check if this is the last table, then send response
          counter++;
          if (counter === tables.length) {
            res.json(data);
          }
        });
      });
    });
  });


  // get category data
  app.get('/category-data', (req, res) => {
    db.all('SELECT * FROM category', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  // get sub-category data
  app.get('/sub-category-data', (req, res) => {
    db.all('SELECT * FROM sub_category', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

// get sub-category data for specific category id
  app.get('/sub-category/:id', (req, res) => {
    const subId = req.params.id;
    db.all('SELECT * FROM sub_category WHERE cat_id = ?', [subId], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  // get all dua data
  app.get('/dua-data', (req, res) => {
    db.all('SELECT * FROM dua', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

 // get dua data for specific category id
  app.get('/duas/:id', (req, res) => {
    const catId = req.params.id;
    // console.log(catId)
    db.all('SELECT * FROM dua WHERE cat_id = ?', [catId], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

app.get('/', (req, res) => {
    res.send('Server is running!');
  });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});