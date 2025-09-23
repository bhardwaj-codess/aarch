
  require('dotenv').config();
  const { createServer } = require('http');
  const app  = require('./app');
  const server = createServer(app);
  const io   = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  const { connectToDatabase } = require('./config/db');
  require('./socket')(io);

  const port = process.env.PORT || 8000;

  (async () => {
    try {
      await connectToDatabase(process.env.MONGO_URI);
      server.listen(port, () => {
        console.log(`Server and socket listening on http://localhost:${port}`);
      });
    } catch (err) {
      console.error('Failed to start server:', err.message);
      process.exit(1);
    }
  })();