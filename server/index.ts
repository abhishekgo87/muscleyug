
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Muscleyug backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} par`);
});

app.get('/test-db', async (req, res) => {
  const { data, error } = await supabase.from('test').select('*');
  if (error) {
    res.json({ message: 'Connection working, but no table found (thats okay for now)', error: error.message });
  } else {
    res.json({ message: 'Connected successfully!', data });
  }
});