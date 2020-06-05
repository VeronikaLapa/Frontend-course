import { Request, Response } from 'express';

import { Locations } from '../db/models/location';

const create = (req: Request, res: Response) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    city: req.body.city,
    country: req.body.country
  };

  Locations.create(data).then(x => {
    res.status(201);
    res.send(x.get());
  });
};

const list = (req: Request, res: Response) => {
  Locations.getAll(req.body.order, req.query)
    .then((value: Locations[]) => res.send(value))
    .catch(() => res.sendStatus(404));
};

const item = (req: Request, res: Response) => {
  const id = req.params.id;
  Locations.findByPk(id).then(value => {
    if (value) {
      res.json(value.get());
    } else {
      res.sendStatus(404);
    }
  });
};
const deleteById = (req: Request, res: Response) => {
  const id = req.params.id;
  Locations.destroy({ where: { id } }).then(rowCount => {
    if (rowCount === 1) {
      console.log('Item deleted');
      res.sendStatus(204);
    } else {
      console.log('Nothing deleted');
      res.sendStatus(204);
    }
  });
};
const deleteAll = (req: Request, res: Response) => {
  Locations.destroy({ where: {} }).then(rowCount => {
    console.log(`deleted ${rowCount} items`);
    res.sendStatus(204);
  });
};

const pages = (req: Request, res: Response) => {
  Locations.getAll('date', req.params).then(allLocations => {
    const pagesSize = req.body.pageSize;
    const pagesList = [];
    for (let i = 0; i < allLocations.length; i += pagesSize) {
      pagesList.push(allLocations.slice(i, i + pagesSize));
    }
    res.status(200).send(pagesList);
  });
};

const update = (req: Request, res: Response) => {
  if (Object.keys(req.body).find(x => x !== 'description' && x !== 'city' && x !== 'country')) {
    res.sendStatus(404);
  }
  const updateInfo = req.body;
  const id = req.params.id;
  Locations.update(updateInfo, { where: { id } }).then(value => res.sendStatus(200));
};

const setVisited = (req: Request, res: Response) => {
  const id = req.params.id;
  let visited;
  if (req.method === 'POST') {
    visited = true;
  } else if (req.method === 'DELETE') {
    visited = false;
  } else {
    res.status(404);
  }
  Locations.update({ visited }, { where: { id } }).then(value => res.status(200).send(value));
};

const getAllWithOrder = (req: Request, res: Response) => {
  Locations.getAll(req.body.order, req.query)
    .then((locations: Locations[]) => {
      const order = req.body.orderList;
      const result = [];
      for (const id of order) {
        if (id >= 0 && id < locations.length) {
          result.push(locations[id]);
        }
      }
      for (let i = 0; i < locations.length; ++i) {
        if (!order.includes(i)) {
          result.push(locations[i]);
        }
      }
      res.send(result);
    })
    .catch(() => res.sendStatus(404));
};
export { list, create, item, deleteById, deleteAll, pages, update, setVisited, getAllWithOrder };
