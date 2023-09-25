const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const TMDB_API_KEY = '4848bcd4d1b10e9fecb6dea36217ab66'
// Set up SQLite database connection
const db = new sqlite3.Database('./database.sqlite');

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err) {
    if (err) {
      return res.json({ success: false, error: 'Error signing up. Please try again.' });
    }
    res.json({ success: true });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log("Login endpoint hit with:", req.body);
  
  db.get('SELECT password FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      return res.json({ success: false, error: 'Error logging in. Please try again.' });
    }
    if (row && await bcrypt.compare(password, row.password)) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'Invalid email or password.' });
    }
  });
});

const fetchMultiplePages = async (pages) => {
  let allMovies = [];

  for (let page = 1; page <= pages; page++) {
      try {
          const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
          allMovies = allMovies.concat(response.data.results);
      } catch (error) {
          console.error(`Error fetching movies from TMDb on page ${page}:`, error);
          throw new Error('Failed to fetch movies');
      }
  }

  return allMovies;
};

app.get('/movies', async (req, res) => {
  try {
    const page = req.query.page || 1; // Get the page number from the query parameter
    const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching movies from TMDb:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});


app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
