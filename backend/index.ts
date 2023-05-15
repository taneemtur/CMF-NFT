import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { CategoriesRoute, CollectionsRoute, NFTSRoute, ProfileRoute } from './routes';
import cors from 'cors';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/profile', ProfileRoute);
app.use('/collections', CollectionsRoute);
app.use('/nfts', NFTSRoute);
app.use('/categories', CategoriesRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});