'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const { BlogPosts } = require('../models');
const {PORT, TEST_DATABASE_URL} = require('../config')
const {app, runServer, closeServer} = require('../server')

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);



// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    BlogPosts.deleteMany({})
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}


// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedBlogPostData() {
  console.info('seeding blog post data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      title: faker.lorem.sentence(),
      content: faker.lorem.text()
    });
  }
  // this will return a promise
  return BlogPosts.insertMany(seedData);
}


describe('blog post api tests', function() {
  
  before(function() {
    return runServer(TEST_DATABASE_URL, PORT);
  });

  after( function() {
    return closeServer();
  });

  beforeEach(function () {
    return seedBlogPostData();
  });

  afterEach(function () {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });


  it('Should list content on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ['id', 'title', 'content', 'author'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it('Should find by ID on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        const id = res.body[0].id
        return chai.request(app)
          .get(`/blog-posts/${id}`)
          .then(function(res) {
            expect(res).to.have.status(200)
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
          })
      });
  });

  it('should add an item on POST', function() {
    const newItem = {
      content: 'test',
      title: 'test',
      author: 'test',
    };
    return chai.request(app)
      .post('/blog-posts')
      .send(newItem)
      .then(function(res) {
        const expectedKeys = ['id', 'title', 'content', 'author'];
        expect(res).to.have.status(201);
        // expect(res).to.be.json;
        // expect(res.body).to.be.a('object');
        // expect(res.body).to.include.keys(expectedKeys);
        // expect(res.body.id).to.not.equal(null);
        // expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });

  it('should update items on PUT', function() {
    const updateData = {
      content: 'test',
      title: 'test',
      author: 'test',
    };
    return chai.request(app)
      // first have to get so we have an idea of object to update
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});