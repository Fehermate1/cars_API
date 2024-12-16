import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
app.use(bodyParser.json());
const PORT = 3020
app.listen(PORT);
console.log(`The server is running on localhost:${PORT}`)

const db = new sqlite3.Database(`./db.sqlite`);

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, color TEXT, year INTEGER);"
  );
});

//GET ALL
app.get("/cars", (req, res) => {
  db.all("SELECT * FROM cars", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

//GET BY id
app.get("/cars/:id", (req, res) => {
  const { id } = req.params.id;
  db.get("SELECT * FROM cars WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: "No Car Found" });
    } else {
      res.json(row);
    }
  });
});

//POST
app.post("/cars", (req, res) => {
  const { brand, model, color, year } = req.body;
  db.run(
    "INSERT INTO cars (brand, model, color, year) VALUES (?, ?, ?, ?)",
    [brand, model, color, year],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

//PUT
app.put("/cars/:id", (res, req) => {
  const { id } = req.params.id;
  const { brand, model, color, year } = req.body;
  db.run(
    "UPDATE cars SET brand = ?, model = ?, color = ?, year = ? WHERE id = ?",
    [brand, model, color, year, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(201).json({ id: this.lastID });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  );
});

//DELETE
app.delete("/cars/:id", (req, res) => {
  const { id } = req.params.id;
  const { brand, model, color, year } = req.body;
  db.run(
    "DELETE cars SET brand = ?, model = ?, color = ?, year =? WHERE id = ?",
    [brand, model, color, year],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(201).json({ id: this.lastID });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  );
});

