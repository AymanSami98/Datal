// app.js
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { serverError } from './middlewares/index.js';
import router from './routes/index.js';
import fs from 'fs';
import https from 'https';
const app = express();

const {CLIENT_BASE_URL} = process.env;
const key = fs.readFileSync('private.key');
const cert = fs.readFileSync('certificate.crt');
// read the certificate and private key

const options = {
  key,
  cert,
};
console.log(CLIENT_BASE_URL);
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


app.use('/api/v1', router);
app.use([serverError]);
const httpsServer = https.createServer(options, app);

httpsServer.listen(8443);
export default app;
