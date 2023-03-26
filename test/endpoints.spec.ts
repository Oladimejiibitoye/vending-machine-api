import request = require('supertest');
import {Express} from 'express'
import { createServer } from '../src/appUtil';

let app: Express
let client: any

beforeAll(async() => {
  app = await createServer()
  client = request(app)
})


describe('deposit', () => {
  it('should create a new user and deposit to user account', async () => {
    const signupRes = await client.post('/api/auth/signup?role=buyer').send({
      "username": "oladimeji08",
      "password": "password"
    })
    const signinRes = await client.post('/api/auth/login').send({
      "username": "oladimeji08",
      "password": "password"
    })
    const depositRes = await client.put("/api/users/deposit")
    .set("Authorization", `Bearer ${signinRes.body.token}`)
    .send({
      "deposit": 10
    });

    expect(depositRes.body.deposit).toEqual(10)
  })
})

describe('buy', () => {
  it('should create a new user, deposit to user account, create a product and buy product', async () => {
    const signupBuyerRes = await client.post('/api/auth/signup?role=buyer').send({
      "username": "femi08",
      "password": "password01"
    })
    const signinBuyerRes = await client.post('/api/auth/login').send({
      "username": "femi08",
      "password": "password01"
    })
    const depositRes = await client.put("/api/users/deposit")
    .set("Authorization", `Bearer ${signinBuyerRes.body.token}`)
    .send({
      "deposit": 10
    })
    const signupSellerRes = await client.post('/api/auth/signup?role=seller').send({
      "username": "pelumi07",
      "password": "password01"
    })
    const signinSellerRes: any = await client.post('/api/auth/login').send({
      "username": "pelumi07",
      "password": "password01"
    })
    const createProduct = await client.post('/api/products/create').send({
      "productName": "chocochocolalala",
      "amountAvailable": 5,
      "cost": 5
    })
    .set("Authorization", `Bearer ${signinSellerRes.body.token}`)
    const buyProduct = await client.get(`/api/products/buy/${createProduct.body.newProduct.id}`)
    .set("Authorization", `Bearer ${signinBuyerRes.body.token}`);

    expect(buyProduct.body.change.length).toBeGreaterThan(0)
  });
})

describe('get products', () => {
  it('it should return status 200', async () => {
    const res = await client.get('/api/products/')
    expect(res.status).toBe(200)
  });
})


