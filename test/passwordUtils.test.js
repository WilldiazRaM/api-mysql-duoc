const { comparePasswords } = require('../utils/passwordUtils');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');

describe('Password Utils', () => {
    describe('comparePasswords', () => {
        test('debería devolver true para contraseñas coincidentes', async () => {
            bcrypt.compare.mockResolvedValue(true);

            const result = await comparePasswords('password123', 'hashedPassword123');
            expect(result).toBe(true);
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
        });

        test('debería devolver false para contraseñas no coincidentes', async () => {
            bcrypt.compare.mockResolvedValue(false);

            const result = await comparePasswords('password123', 'wrongHashedPassword');
            expect(result).toBe(false);
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'wrongHashedPassword');
        });
    });
});

describe('Password Utilities', () => {
    const plainPassword = 'password123';
    const hashedPassword = '$2a$10$...'; // Add a valid bcrypt hash here
  
    test('should hash a password correctly', async () => {
      const hash = await hashPassword(plainPassword);
      expect(bcrypt.compareSync(plainPassword, hash)).toBe(true);
    });
  
    test('should compare passwords correctly', async () => {
      const result = await comparePasswords(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });
  });
