  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');
  const cookieParser = require('cookie-parser');
  const rateLimit = require('express-rate-limit');

// Import routes
  const authRoutes = require('./routes/auth.routes');
  const supportRoutes = require('./routes/support.routes');
  const feedbackRoutes = require('./routes/feedback.routes');
  const socialRoutes = require('./routes/social.routes');
  const chatRoutes = require('./routes/chat.routes');
  const artistRoutes = require('./routes/artist.routes');
  const organizerRoutes = require('./routes/organizer.routes');
  const appUserRoutes = require('./routes/appUser.routes');

  const app = express();

// Trust reverse proxies
  app.set('trust proxy', 1);

  // Middleware
  app.use(helmet());
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  const otpLimiter = rateLimit({ windowMs: 60 * 1000, max: 5 });
  app.use('/api/auth/request-otp', otpLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/social', socialRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/artist', artistRoutes);
  app.use('/api/organizer', organizerRoutes);
  app.use('/api/appuser', appUserRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

// Load background jobs
  require('./jobs/deleteUsers'); 


  app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err && err.stack ? err.stack : err);
    if (res.headersSent) return next(err);

    const status = err && err.statusCode ? err.statusCode : 500;
    res.status(status).json({ status: false, message: err.message || 'Server error' });
  });

module.exports = app;


