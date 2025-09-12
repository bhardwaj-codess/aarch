  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');
  const cookieParser = require('cookie-parser');
  const rateLimit = require('express-rate-limit');


  const authRoutes = require('./routes/auth.routes');
  const profileRoutes = require('./routes/profileRoutes');
  const supportRoutes = require('./routes/support.routes');
  const feedbackRoutes = require('./routes/feedback.routes');

  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  const otpLimiter = rateLimit({ windowMs: 60 * 1000, max: 5 });
  app.use('/api/auth/request-otp', otpLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/feedback', feedbackRoutes);

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  require('./jobs/deleteUsers'); 

  module.exports = app;


