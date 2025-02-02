require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');

const authRoutes = require('./src/routes/authRoutes');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.get('/ping', (req, res) => {
    res.send({ message: '🏓 Pong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => logger.info(`🚀 Servidor rodando na porta ${PORT}`));

// routes
app.use('/api/auth', authRoutes);