const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const { DB_PATH } = require('../config');

const dbFile = DB_PATH;
const dbDir = path.dirname(dbFile);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

const DEFAULT_PREFERENCES = {
  reminderTime: '08:00',
  dailyGoal: 15
};

const ensureTables = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      bio TEXT,
      preferences TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS meditation_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      duration REAL NOT NULL,
      type TEXT,
      notes TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS motivational_quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS community_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS community_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES community_posts(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.all('PRAGMA table_info(users)', (err, columns) => {
      if (err) {
        console.error('Error inspecting users table:', err);
        return;
      }

      const columnNames = columns.map((column) => column.name);

      if (!columnNames.includes('bio')) {
        db.run('ALTER TABLE users ADD COLUMN bio TEXT', (alterErr) => {
          if (alterErr) {
            console.error('Error adding bio column to users table:', alterErr);
          }
        });
      }

      if (!columnNames.includes('preferences')) {
        db.run('ALTER TABLE users ADD COLUMN preferences TEXT', (alterErr) => {
          if (alterErr) {
            console.error('Error adding preferences column to users table:', alterErr);
          }
        });
      }
    });

    db.get('SELECT COUNT(*) as count FROM motivational_quotes', (err, row) => {
      if (err) {
        console.error('Error checking quotes table:', err);
        return;
      }

      if (row.count === 0) {
        const quotes = [
          'Breathe in peace, breathe out tension.',
          'The present moment is the only moment available to us.',
          'Peace comes from within. Do not seek it without.',
          'Quiet the mind, and the soul will speak.',
          "Meditation is the soul's perspective glass."
        ];

        const stmt = db.prepare('INSERT INTO motivational_quotes (text) VALUES (?)');
        quotes.forEach((quote) => stmt.run(quote));
        stmt.finalize();
      }
    });
  });
};

ensureTables();

const parsePreferences = (preferences) => {
  if (!preferences) {
    return { ...DEFAULT_PREFERENCES };
  }

  try {
    const parsed = JSON.parse(preferences);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed
    };
  } catch (error) {
    console.warn('Failed to parse user preferences, using defaults', error);
    return { ...DEFAULT_PREFERENCES };
  }
};

const mapUserRow = (row) => {
  if (!row) return null;

  const preferences = parsePreferences(row.preferences);

  return {
    id: row.id,
    username: row.username,
    email: row.email,
    bio: row.bio || '',
    preferences,
    createdAt: row.created_at
  };
};

const mapPostRow = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    content: row.content,
    likesCount: row.likesCount ?? 0,
    createdAt: row.createdAt,
    author: {
      id: row.authorId,
      username: row.authorUsername
    },
    comments: row.comments || []
  };
};

const mapCommentRow = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    content: row.content,
    createdAt: row.createdAt,
    author: {
      id: row.authorId,
      username: row.authorUsername
    }
  };
};

const getUserByEmailWithPassword = (email) =>
  new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);

      resolve({
        password: row.password,
        user: mapUserRow(row)
      });
    });
  });

const getUserById = (id) =>
  new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username, email, bio, preferences, created_at FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(mapUserRow(row));
      }
    );
  });

const createUser = (username, email, password) =>
  new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password, bio, preferences) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(
      [username, email, password, '', JSON.stringify(DEFAULT_PREFERENCES)],
      function runCallback(err) {
        if (err) return reject(err);
        getUserById(this.lastID)
          .then(resolve)
          .catch(reject);
      }
    );
    stmt.finalize();
  });

const updateUser = (id, data) =>
  new Promise((resolve, reject) => {
    const { username, bio = '', preferences } = data;
    const serializedPreferences = JSON.stringify({
      ...DEFAULT_PREFERENCES,
      ...(preferences || {})
    });

    db.run(
      'UPDATE users SET username = ?, bio = ?, preferences = ? WHERE id = ?',
      [username, bio, serializedPreferences, id],
      function runCallback(err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });

const createMeditationSession = (userId, session) =>
  new Promise((resolve, reject) => {
    const { duration, type, notes } = session;
    const stmt = db.prepare(
      'INSERT INTO meditation_sessions (user_id, duration, type, notes) VALUES (?, ?, ?, ?)'
    );
    stmt.run([userId, duration, type || null, notes || null], function runCallback(err) {
      if (err) return reject(err);

      db.get(
        'SELECT id, duration, type, notes, date FROM meditation_sessions WHERE id = ?',
        [this.lastID],
        (rowErr, row) => {
          if (rowErr) return reject(rowErr);
          resolve(row);
        }
      );
    });
    stmt.finalize();
  });

const getMeditationSessionsByUser = (userId) =>
  new Promise((resolve, reject) => {
    db.all(
      'SELECT id, duration, type, notes, date FROM meditation_sessions WHERE user_id = ? ORDER BY date DESC',
      [userId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });

const deleteMeditationSession = (userId, sessionId) =>
  new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM meditation_sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId],
      function runCallback(err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      }
    );
  });

const getQuotes = () =>
  new Promise((resolve, reject) => {
    db.all('SELECT id, text FROM motivational_quotes', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

const getQuoteOfTheDay = () =>
  new Promise((resolve, reject) => {
    db.get(
      `SELECT id, text
       FROM motivational_quotes
       ORDER BY id
       LIMIT 1 OFFSET CAST(strftime('%j', 'now') AS INTEGER) % (
         SELECT COUNT(*) FROM motivational_quotes
       )`,
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });

const createCommunityPost = (userId, content) =>
  new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO community_posts (user_id, content) VALUES (?, ?)'
    );
    stmt.run([userId, content], function runCallback(err) {
      if (err) return reject(err);

      db.get(
        `SELECT p.id,
                p.content,
                p.likes_count AS likesCount,
                p.created_at AS createdAt,
                u.id AS authorId,
                u.username AS authorUsername
         FROM community_posts p
         JOIN users u ON u.id = p.user_id
         WHERE p.id = ?`,
        [this.lastID],
        (rowErr, row) => {
          if (rowErr) return reject(rowErr);
          resolve(mapPostRow(row));
        }
      );
    });
    stmt.finalize();
  });

const listCommunityPosts = () =>
  new Promise((resolve, reject) => {
    db.all(
      `SELECT p.id,
              p.content,
              p.likes_count AS likesCount,
              p.created_at AS createdAt,
              u.id AS authorId,
              u.username AS authorUsername
       FROM community_posts p
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC`,
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(mapPostRow));
      }
    );
  });

const addLikeToPost = (postId) =>
  new Promise((resolve, reject) => {
    db.run(
      'UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?',
      [postId],
      function runCallback(err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      }
    );
  });

const createCommunityComment = (postId, userId, content) =>
  new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO community_comments (post_id, user_id, content) VALUES (?, ?, ?)'
    );
    stmt.run([postId, userId, content], function runCallback(err) {
      if (err) return reject(err);

      db.get(
        `SELECT c.id,
                c.content,
                c.created_at AS createdAt,
                u.id AS authorId,
                u.username AS authorUsername
         FROM community_comments c
         JOIN users u ON u.id = c.user_id
         WHERE c.id = ?`,
        [this.lastID],
        (rowErr, row) => {
          if (rowErr) return reject(rowErr);
          resolve(mapCommentRow(row));
        }
      );
    });
    stmt.finalize();
  });

const getCommentsForPost = (postId) =>
  new Promise((resolve, reject) => {
    db.all(
      `SELECT c.id,
              c.content,
              c.created_at AS createdAt,
              u.id AS authorId,
              u.username AS authorUsername
       FROM community_comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [postId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(mapCommentRow));
      }
    );
  });

module.exports = {
  db,
  getUserByEmailWithPassword,
  getUserById,
  createUser,
  updateUser,
  createMeditationSession,
  getMeditationSessionsByUser,
  deleteMeditationSession,
  getQuotes,
  getQuoteOfTheDay,
  createCommunityPost,
  listCommunityPosts,
  addLikeToPost,
  createCommunityComment,
  getCommentsForPost,
  DEFAULT_PREFERENCES
};
