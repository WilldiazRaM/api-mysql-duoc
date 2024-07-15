import { expect } from 'chai';
import axios from 'axios';

const baseURL = 'https://api-mysql-duoc.onrender.com/auth';

describe('Auth Controller', function() {
  this.timeout(5000); // Aumenta el tiempo de espera para todas las pruebas

  describe('POST /auth/registrar', () => {
    it('debe retornar 400 si falta algún campo requerido', async () => {
      try {
        await axios.post(`${baseURL}/registrar`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'username': '',
            'email': '',
            'password': '',
            'role': ''
          }
        });
      } catch (error) {
        console.log('Error Response:', error.response.data);
        expect(error.response.status).to.equal(400);
        expect(error.response.data.errors[0].msg).to.equal('El nombre de usuario debe ser una cadena');
        expect(error.response.data.errors[1].msg).to.equal('La contraseña debe ser una cadena');
        expect(error.response.data.errors[2].msg).to.equal('Debe ser un correo electrónico válido');
      }
    });

    it('debe retornar 201 si el usuario se crea exitosamente', async () => {
      const response = await axios.post(`${baseURL}/registrar`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'username': 'Juan Perez',
          'email': 'juan.p3@duocuc.cl',
          'password': 'password123',
          'role': 'user'
        }
      });
      console.log('Success Response:', response.data);
      expect(response.status).to.equal(201);
      expect(response.data.message).to.equal('Usuario registrado exitosamente');
    });

    it('debe retornar 409 si el email ya está en uso', async () => {
      try {
        await axios.post(`${baseURL}/registrar`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'username': 'Juan Perez',
            'email': 'juan.p3@duocuc.cl',
            'password': 'password123',
            'role': 'user'
          }
        });
      } catch (error) {
        console.log('Error Response:', error.response.data);
        expect(error.response.status).to.equal(409);
        expect(error.response.data.error).to.equal('El correo electrónico ya está en uso');
      }
    });
  });

  describe('POST /auth/login', () => {
    it('debe retornar 400 si email o password no están presentes', async () => {
      try {
        await axios.post(`${baseURL}/login`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'email': '',
            'password': ''
          }
        });
      } catch (error) {
        console.log('Error Response:', error.response.data);
        expect(error.response.status).to.equal(400);
        expect(error.response.data.errors[0].msg).to.equal('El campo x-email es requerido');
        expect(error.response.data.errors[1].msg).to.equal('El campo x-password es requerido');
      }
    });

    it('debe retornar 200 y el token si las credenciales son correctas', async () => {
      try {
        const response = await axios.post(`${baseURL}/login`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'email': 'juan.p3@duocuc.cl',
            'password': 'password123'
          }
        });
        console.log('Success Response:', response.data);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('token');
      } catch (error) {
        console.log('Error Response:', error.response.data);
        throw error; // Re-throw the error to make the test fail
      }
    });

    it('debe retornar 401 si las credenciales son incorrectas', async () => {
      try {
        await axios.post(`${baseURL}/login`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'email': 'juan.p3@duocuc.cl',
            'password': 'wrongpassword'
          }
        });
      } catch (error) {
        console.log('Error Response:', error.response.data);
        expect(error.response.status).to.equal(401);
        expect(error.response.data.error).to.equal('Credenciales incorrectas');
      }
    });

    describe('Auth Controller - SQL Injection Test', () => {
      it('debe proteger contra inyecciones de SQL', async () => {
        try {
          await axios.post(`${baseURL}/login`, {}, {
            headers: {
              'Content-Type': 'application/json',
              'email': "' OR 1=1 --",
              'password': 'anything'
            }
          });
        } catch (error) {
          console.log('Error Response:', error.response.data);
          expect(error.response.status).to.not.equal(200);
          expect(error.response.data.error).to.include('Credenciales incorrectas'); // Asegúrate de que tu API maneje este caso correctamente
        }
      });
    });
  });
});
