/* eslint-disable @typescript-eslint/no-explicit-any */
import supertest from 'supertest';

import app from '../src/app';
import db from '../src/db';

const request = supertest(app);

const cleanDb = async () => {
  const tableNames = Object.keys(db.sequelize.models);
  await db.sequelize.query(`TRUNCATE ${tableNames.map(name => `"${name}"`).join(', ')} CASCADE;`);
};

describe('API', () => {
  beforeAll(async () => {
    // Здесь создаются все таблицы по моделям
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await cleanDb();
  });

  it('Должно вернуть список мест', async () => {
    const res = await request.get('/locations');

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('Должно создать место', async () => {
    const resPost = await request.post('/locations').send({
      name: 'test name',
      description: 'test description'
    });

    const resGet = await request.get('/locations');
    const expectedPartResponse = {
      name: 'test name',
      description: 'test description',
      visited: false
    };

    expect(resPost.status).toBe(201);
    expect(resGet.body[0]).toMatchObject(expectedPartResponse);
  });

  it('Должно вернуть место по id', async () => {
    await request.post('/locations').send({
      name: 'test name by id',
      description: 'test description by id'
    });

    const resGet = await request.get('/locations/2');
    const expectedPartResponse = {
      name: 'test name by id',
      description: 'test description by id',
      visited: false
    };

    expect(resGet.status).toBe(200);
    expect(resGet.body).toMatchObject(expectedPartResponse);
  });

  it('Должно удалить место по id', async () => {
    await request.post('/locations').send({
      name: 'test name by id',
      description: 'test description by id'
    });
    const resDelete = await request.delete('/locations/3');
    const resGetAfter = await request.get('/locations/3');

    expect(resDelete.status).toBe(204);
    expect(resGetAfter.status).toBe(404);
  });

  it('Должно удалять все места', async () => {
    await request.post('/locations').send({
      name: 'first',
      description: 'test description by id'
    });
    await request.post('/locations').send({
      name: 'second',
      description: 'test description by id'
    });
    const resDelete = await request.delete('/locations');
    const resGet = await request.get('/locations');

    expect(resDelete.status).toBe(204);
    expect(resGet.body).toMatchObject([]);
  });

  it('Должно сортировать места', async () => {
    await request.post('/locations').send({
      name: 'b',
      description: 'test description by id'
    });
    await request.post('/locations').send({
      name: 'a',
      description: 'test description by id'
    });
    await request.post('/locations').send({
      name: 'c',
      description: 'test description by id'
    });
    const resGetName = await request.get('/locations/sort').send({ order: 'name' });
    const resGetDate = await request.get('/locations/sort').send({ order: 'date' });
    const resGetError = await request.get('/locations/sort').send({ order: 'rubbish' });

    expect(resGetName.body[0].name).toBe('a');
    expect(resGetDate.body[0].name).toBe('b');
    expect(resGetError.status).toBe(404);
  });

  it('Должно выводить постранично', async () => {
    await request.post('/locations').send({
      name: '1',
      description: 'test description by id'
    });
    await request.post('/locations').send({
      name: '2',
      description: 'test description by id'
    });
    await request.post('/locations').send({
      name: '3',
      description: 'test description by id'
    });
    await request.post('/locations').send({
      name: '4',
      description: 'test description by id'
    });
    const resGetPages = await request.get('/locations/pages').send({ pageSize: 3 });

    expect(resGetPages.body).toHaveLength(2);
    expect(resGetPages.body[0]).toHaveLength(3);
    expect(resGetPages.body[1]).toHaveLength(1);
  });

  it('Должно изменять описание', async () => {
    const resPost = await request.post('/locations').send({
      name: 'test',
      description: 'init description'
    });
    const updateDesc = await request
      .patch(`/locations/${resPost.body.id}`)
      .send({ description: 'new description' });
    const resGet = await request.get(`/locations/${resPost.body.id}`);
    expect(updateDesc.status).toBe(200);
    expect(resGet.body.description).toBe('new description');
  });

  it('Должно изменять статус посещения', async () => {
    const resPost = await request.post('/locations').send({
      name: 'test',
      description: 'init description'
    });
    await request.post(`/locations/${resPost.body.id}/visited`);
    const resVisit = await request.get(`/locations/${resPost.body.id}`);
    await request.delete(`/locations/${resPost.body.id}/visited`);
    const resUnvisit = await request.get(`/locations/${resPost.body.id}`);

    expect(resVisit.body.visited).toBe(true);
    expect(resUnvisit.body.visited).toBe(false);
  });
  it('Должно возвращать по описанию', async () => {
    await request.post('/locations').send({
      name: 'test1',
      description: 'test',
      country: 'a'
    });
    await request.post('/locations').send({
      name: 'test2',
      description: 'test',
      country: 'b'
    });
    await request.post('/locations').send({
      name: 'test3',
      description: 'test',
      country: 'a'
    });
    await request.post('/locations').send({
      name: 'test4',
      description: 'test',
      country: 'c'
    });
    const resGet = await request.get(`/locations?country=a`);
    expect(resGet.body).toHaveLength(2);
  });
  it('Должно менять порядок', async () => {
    await request.post('/locations').send({
      name: 'test1',
      description: 'test',
      country: 'a'
    });
    await request.post('/locations').send({
      name: 'test2',
      description: 'test',
      country: 'b'
    });
    await request.post('/locations').send({
      name: 'test3',
      description: 'test',
      country: 'a'
    });
    const resGet = await request.get(`/locations/order`).send({ orderList: [2, 0] });
    expect(resGet.body).toHaveLength(3);
    expect(resGet.body[0].name).toBe('test3');
    expect(resGet.body[1].name).toBe('test1');
    expect(resGet.body[2].name).toBe('test2');
  });
  // Можете сами дописать больше тестов
});
