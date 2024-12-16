import express from "expresss";
import bodyParser from "body-parser";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

PORT = 3020

const startServer = () => {
    app.listen(PORT)
    console.log(`The server is running on localhost:${PORT}`)
}
const db = new sqlite3.Database("./cars.sqlite")

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS cars (id PRIMARY KEY AUTO INCREMENT, brand TEXT, model TEXT, color TEXT, year INTEGER NOT NULL)")
});

app.get("./cars", (req, res) =>{
    db.all("SELECT * FROM cars;", [], (err, rows) => {
        if (err){
            res.status(500).json({error: err.message})
        }
        else {
            res.json(200);
        }
    })
});

app.get("./cars/:id", (req, res) => {
    db.all("SELECT * FROM cars WHERE id = ?;", [], (err, rows) => {
        if (err){
            res.status(500).json({error: err.message})
        }
        else {
            res.json(200)
        }
    })
});

app.post('./cars', (req, res) => {
    const (brand, model, color, year) = req.body;
    if (!brand){
        return res.status(400).json({error: "No Brand Given"})
    }
    else {
        res.json(200);
    }
});