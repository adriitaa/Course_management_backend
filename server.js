require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/course_api');
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();

