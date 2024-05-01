// app.js
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { serverError } from './middlewares/index.js';
import router from './routes/index.js';
import path from 'path';
const { CLIENT_BASE_URL } = process.env;

const app = express();

app.use([
  express.json({ limit: '50mb' }),
  express.urlencoded({ extended: true, limit: '50mb' }),
  compression(),
  cookieParser(),
]);

app.use(cors({
  origin: CLIENT_BASE_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Ensure methods match your client requests
}));

app.get('/', (_request, response) => response.json({ message: 'Server Is Running' }));

app.get('/.well-known/pki-validation/DA84D4EF234FA3167627B20096D3ED90.txt', (req, res) => {
  const filePath = path.resolve(process.cwd(), 'DA84D4EF234FA3167627B20096D3ED90.txt');
  res.sendFile(filePath);
});


app.use('/api/v1', router);
app.use([serverError]);

export default app;
