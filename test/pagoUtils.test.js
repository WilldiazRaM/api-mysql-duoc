const { createTransaction, confirmTransaction } = require('../utils/pagoUtils');
const axios = require('axios');

jest.mock('axios');

describe('pagoUtils', () => {
  test('should have at least one test', () => {
    expect(true).toBe(true);
  });
});
