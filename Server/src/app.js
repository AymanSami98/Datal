// app.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { serverError,
    notFound } from './middlewares/index.js';
    const app = express();
    import router from './routes/index.js';
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
app.use('/api/v1', router);
app.use([serverError, notFound]);
export default app;
