const { calculateOrderTotal } = require('../utils/orderUtils');

describe('Order Utilities', () => {
  test('should calculate order total correctly', () => {
    const items = [
      { price: 50, quantity: 2 },
      { price: 100, quantity: 1 },
    ];
    const result = calculateOrderTotal(items);
    expect(result).toBe(200);  // 50*2 + 100*1 = 200
  });

  test('should return 0 if no items are passed', () => {
    const items = [];
    const result = calculateOrderTotal(items);
    expect(result).toBe(0);
  });

  test('should handle items with zero quantity', () => {
    const items = [
      { price: 50, quantity: 0 },
      { price: 100, quantity: 1 },
    ];
    const result = calculateOrderTotal(items);
    expect(result).toBe(100);  // 50*0 + 100*1 = 100
  });
});
