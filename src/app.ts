import express from 'express';
import cors from 'cors';
import memberRoutes from './routes/member.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/members', memberRoutes);

export default app;
