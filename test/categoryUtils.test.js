const { validateCategoryData } = require('../utils/categoryUtils');

describe('Category Utilities', () => {
  test('should validate category data successfully', () => {
    const categoryData = { name: 'Valid Category' };
    const result = validateCategoryData(categoryData);
    expect(result).toBeNull();
  });

  test('should return an error if category data is invalid', () => {
    const categoryData = { name: '' };
    const result = validateCategoryData(categoryData);
    expect(result).toBe('Invalid category data');
  });
});
