const { getOrderById, createOrder, updateOrder, deleteOrder } = require('../models/orderModel');
const pool = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('Order Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch an order by ID', async () => {
    const mockOrder = { id: 1, total: 100 };
    pool.query.mockResolvedValue({ rows: [mockOrder] });

    const order = await getOrderById(1);
    expect(order).toEqual(mockOrder);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM orders WHERE id = $1', [1]);
  });

  test('should create a new order', async () => {
    const newOrder = { total: 100 };
    pool.query.mockResolvedValue({ rows: [newOrder] });

    const order = await createOrder(newOrder);
    expect(order).toEqual(newOrder);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO orders (total) VALUES ($1) RETURNING *',
      [newOrder.total]
    );
  });

  test('should update an order', async () => {
    const updatedOrder = { id: 1, total: 150 };
    pool.query.mockResolvedValue({ rows: [updatedOrder] });

    const order = await updateOrder(updatedOrder);
    expect(order).toEqual(updatedOrder);
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE orders SET total = $1 WHERE id = $2 RETURNING *',
      [updatedOrder.total, updatedOrder.id]
    );
  });

  test('should delete an order', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const order = await deleteOrder(1);
    expect(order).toEqual({});
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM orders WHERE id = $1 RETURNING *', [1]);
  });
});
