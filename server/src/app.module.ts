import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { FeatureModule } from './feature/feature.module';
import { TypeModule } from './type/type.module';
import { OrderModule } from './order/order.module';

import { ValidTokenMiddleware } from './auth/middlewares/valid-token.middleware';

import config from '../typeorm.config';

import {
  AVAILABLE_ROUTES,
  PROTECTED_ROUTES,
} from './constants/routes.constant';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    UserModule,
    AuthModule,
    ProductModule,
    BrandModule,
    TypeModule,
    FeatureModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // AUTH
    consumer.apply(ValidTokenMiddleware).forRoutes({
      path: '/auth/auth',
      method: RequestMethod.GET,
    });

    // OTHER
    consumer
      .apply(ValidTokenMiddleware)
      .exclude(...AVAILABLE_ROUTES)
      .forRoutes(...PROTECTED_ROUTES);
  }
}
