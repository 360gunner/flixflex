import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
dotenv.config();
connectDB();

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());


app.get('/', (_req: Request, res: Response) => {
  res.send('FlixFlex API is running...');
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


export default app;