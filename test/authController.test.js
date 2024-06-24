import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

chai.use(chaiHttp);
const should = chai.should();

describe('Auth Controller', () => {
  describe('POST /auth/login', () => {
    it('should login a user', (done) => {
      chai.request(server)
          .post('/auth/login')
          .set('x-email', 'test@example.com')
          .set('x-password', 'password123')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            done();
          });
    });

    it('should return error for invalid credentials', (done) => {
      chai.request(server)
          .post('/auth/login')
          .set('x-email', 'invalid@example.com')
          .set('x-password', 'wrongpassword')
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql('Credenciales incorrectas');
            done();
          });
    });
  });

  describe('POST /auth/registrar', () => {
    it('should register a user', (done) => {
      chai.request(server)
          .post('/auth/registrar')
          .set('x-nombre', 'Test User')
          .set('x-email', 'testuser@example.com')
          .set('x-password', 'password123')
          .set('x-role', 'user')
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Usuario registrado exitosamente');
            done();
          });
    });

    it('should return error for missing fields', (done) => {
      chai.request(server)
          .post('/auth/registrar')
          .set('x-email', 'testuser@example.com')
          .set('x-password', 'password123')
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error').eql('Nombre, email, contraseña y rol son requeridos');
            done();
          });
    });
  });
});
