import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import { DatabaseInitializer } from './src/database/DatabaseInitializer';
import authRouter from './src/router/authRouter';
import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter';
import { errorHandler } from './src/middleware/errorHandler';

dotenv.config();

const app = express();

// -------------------- MIDDLEWARES --------------------
app.use(cors());
app.use(express.json());


// -------------------- ROUTES --------------------
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user',  userRouter);
app.use('/api/v1/admin', adminRouter);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

async function startServer() {
  try {
    await DatabaseInitializer.initialize();

    const PORT = Number(process.env.PORT) || 4000;
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Failed to start server', error);
    process.exit(1);
  }
}

startServer();
