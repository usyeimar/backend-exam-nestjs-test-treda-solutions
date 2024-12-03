export const createProductsData = (categories: any[]) => [
  {
    name: 'Laptop',
    description: 'High performance laptop with latest specifications',
    price: 999.99,
    stock: 10,
    categoryId: categories[0].id,
  },
  {
    name: 'Smartphone',
    description: 'Latest model smartphone with advanced features',
    price: 699.99,
    stock: 15,
    categoryId: categories[0].id,
  },
  {
    name: 'T-Shirt',
    description: 'Premium cotton t-shirt, comfortable and stylish',
    price: 19.99,
    stock: 100,
    categoryId: categories[1].id,
  },
  {
    name: 'Programming Book',
    description: 'Comprehensive guide to modern programming',
    price: 49.99,
    stock: 30,
    categoryId: categories[2].id,
  },
];
