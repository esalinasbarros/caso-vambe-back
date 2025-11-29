import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from '@koa/bodyparser';
import dotenv from 'dotenv';
import router from './routes';
import { initDatabase } from './utils/database';

dotenv.config();

initDatabase();

const app = new Koa();

const allowedOrigins = [
  'https://caso-vambe-esb.netlify.app'
];

app.use(cors({
  origin: (ctx) => {
    const origin = ctx.request.header.origin;
    if (!origin) return '';
    
    if (origin.startsWith('http://localhost:') || origin === 'http://localhost') {
      return origin;
    }
    
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    
    return '';
  },
  credentials: true
}));
app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3001;

app.listen(PORT);
