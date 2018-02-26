const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {PORT, TEST_DATABASE_URL} = require('../config')
const {app, runServer, closeServer} = require('../server')

chai.use(chaiHttp);

describe('blog post api tests', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, PORT);
  });
  after( function() {
    return closeServer();
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