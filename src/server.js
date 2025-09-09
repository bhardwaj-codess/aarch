require('dotenv').config();
const app = require('./app');
const { connectToDatabase } = require('./config/db');

const port = process.env.PORT || 8000;

(async () => {
  try {
    await connectToDatabase(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();


