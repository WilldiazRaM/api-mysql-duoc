const { getUser, createUser } = require('../controllers/userController');
const { getUserById, createUser: createUserModel } = require('../models/userModel');

jest.mock('../models/userModel');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 1 }, body: { username: 'testuser', password: 'password123' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test('should fetch a user by ID', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    getUserById.mockResolvedValue(mockUser);

    await getUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('should create a new user', async () => {
    const newUser = { id: 1, username: 'testuser' };
    createUserModel.mockResolvedValue(newUser);

    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
  });
});
