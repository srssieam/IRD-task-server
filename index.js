const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;
const db = new sqlite3.Database('dua_main.sqlite');


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



app.get('/', (req, res) => {
    res.send('Server is running!');
  });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});