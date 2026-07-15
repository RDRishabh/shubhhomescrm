import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import leadsRouter from './routes/leads';
import unitsRouter from './routes/units';
import paymentsRouter from './routes/payments';
import documentsRouter from './routes/documents';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadsRouter);
app.use('/api/units', unitsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/documents', documentsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js Backend Server running on http://localhost:${PORT}`);
});
