require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const errorHandler = require('./middleware/error.middleware');
const { limiter } = require('./middleware/rateLimiter.middleware');
const logger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(limiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}

try {
  const authRoutes = require('./routes/auth.routes');
  const adminRoutes = require('./routes/admin.routes');
  const userRoutes = require('./routes/user.routes');
  const orderRoutes = require('./routes/order.routes');

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/orders', orderRoutes);

} catch (err) {
  logger.error('ROUTE LOADING FAILED');
  logger.error(err.stack || err);
}

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(errorHandler);

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION');
  logger.error(err.stack || err);

  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION');
  logger.error(err.stack || err);

  process.exit(1);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;