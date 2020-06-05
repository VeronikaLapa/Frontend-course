import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import * as locations from './controllers/locations';

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use((err: Error, req: Request, res: Response, next: () => void) => {
  console.error(err);

  next();
});

// query params: city | country| description | visited | name
app.get('/locations', locations.list);
// with order == 'name' | 'date' | undefined
app.get('/locations/sort', locations.list);
app.get('/locations/pages', locations.pages);
//set first subsequence of elements
// orderList == [1,3,4] => [1,3,4,0,2,5,6,7,8..]
app.get('/locations/order', locations.getAllWithOrder);
app.get('/locations/:id', locations.item);
app.patch('/locations/:id', locations.update);
app.post('/locations', locations.create);
app.post('/locations/:id/visited', locations.setVisited);
app.delete('/locations/:id/visited', locations.setVisited);
app.delete('/locations/:id', locations.deleteById);
app.delete('/locations', locations.deleteAll);

export default app;
