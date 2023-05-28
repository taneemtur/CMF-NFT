import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { AuctionPricedNFTsRoute, BestCreatorsSellersRoute, CategoriesRoute, CollectionsRoute, FixedPricedNFTsRoute, HeroSectionRouter, MostPopularCollectionRoute, NFTSRoute, ProfileRoute } from './routes';
import cors from 'cors';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

const whitelist = ["http://localhost:3000", "https://superex-nft.vercel.app/", "*"]
const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors({
  origin: '*'
}));
// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/profile', ProfileRoute);
app.use('/collections', CollectionsRoute);
app.use('/nfts', NFTSRoute);
app.use('/categories', CategoriesRoute);
app.use("/landingpage/bestcreatorssellers", BestCreatorsSellersRoute)
app.use("/landingpage/mostpopularcollection", MostPopularCollectionRoute)
app.use("/landingpage/herosection", HeroSectionRouter)
app.use("/transactions/fixedpricednfts", FixedPricedNFTsRoute)
app.use("/transactions/auctionpricednfts", AuctionPricedNFTsRoute)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});