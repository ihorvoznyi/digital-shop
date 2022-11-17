import { RequestMethod } from '@nestjs/common';

import { UserController } from '../user/user.controller';
import { ProductController } from '../product/product.controller';
import { TypeController } from '../type/type.controller';
import { BrandController } from '../brand/controllers/brand.controller';
import { OrderController } from '../order/order.controller';

const USER_ROUTES = [
  { path: '/users/address/:id', method: RequestMethod.POST },
  { path: '/users', method: RequestMethod.GET },
];

const PRODUCT_ROUTES = [
  { path: '/products', method: RequestMethod.GET },
  { path: '/products/:id', method: RequestMethod.GET },
  { path: '/products/type/:id', method: RequestMethod.GET },
];

const ORDER_ROUTES = [];

const BRAND_ROUTES = [
  { path: '/brands', method: RequestMethod.GET },
  { path: '/brands/:id', method: RequestMethod.GET },
];

const TYPE_ROUTES = [
  { path: '/types', method: RequestMethod.GET },
  { path: '/types/:id', method: RequestMethod.GET },
];

export const AVAILABLE_ROUTES = [
  ...USER_ROUTES,
  ...BRAND_ROUTES,
  ...TYPE_ROUTES,
  ...PRODUCT_ROUTES,
];

export const PROTECTED_ROUTES = [
  UserController,
  ProductController,
  TypeController,
  BrandController,
  OrderController,
];
