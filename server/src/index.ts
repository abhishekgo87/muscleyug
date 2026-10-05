import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Permissive CORS for local development and mobile client testing; restrict before production
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('Muscleyug backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
