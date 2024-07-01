const { hashPassword, findUserByEmail } = require('../models/userModel');
const bcrypt = require('bcrypt');
const pool = require('../database');

jest.mock('bcrypt');
jest.mock('../database');

describe('User Model', () => {
    describe('hashPassword', () => {
        test('debería devolver un hash de la contraseña', async () => {
            bcrypt.hash.mockResolvedValue('hashedPassword123');
            const hashedPassword = await hashPassword('password123');
            expect(hashedPassword).toBe('hashedPassword123');
        });

        test('debería usar 10 salt rounds', async () => {
            await hashPassword('password123');
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        });
    });

    describe('findUserByEmail', () => {
        test('debería devolver el usuario si el email existe', async () => {
            const user = { id: 1, email: 'test@example.com' };
            pool.query.mockResolvedValue({ rows: [user] });

            const result = await findUserByEmail('test@example.com');
            expect(result).toEqual(user);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Usuarios" WHERE email = $1', ['test@example.com']);
        });

        test('debería devolver null si el email no existe', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const result = await findUserByEmail('nonexistent@example.com');
            expect(result).toBeNull();
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Usuarios" WHERE email = $1', ['nonexistent@example.com']);
        });
    });
});

describe('User Model', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should fetch a user by ID', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      pool.query.mockResolvedValue({ rows: [mockUser] });
  
      const user = await getUserById(1);
      expect(user).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
    });
  
    test('should create a new user', async () => {
      const newUser = { username: 'testuser', password: 'hashedPassword' };
      pool.query.mockResolvedValue({ rows: [newUser] });
  
      const user = await createUser(newUser);
      expect(user).toEqual(newUser);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        [newUser.username, newUser.password]
      );
    });
  });