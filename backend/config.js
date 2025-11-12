const path = require('path');

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'slow-mind-secret-key';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : ['http://localhost:3000', 'https://antodev00.github.io'];
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'slowmind.sqlite');

module.exports = {
  PORT,
  JWT_SECRET,
  ALLOWED_ORIGINS,
  DB_PATH
};
