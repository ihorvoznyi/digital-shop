import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';

import { ConfigModule } from '@nestjs/config';
import config from '../typeorm.config';

import { ValidTokenMiddleware } from './auth/middlewares/valid-token.middleware';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { BrandModule } from './brand/brand.module';
import { TypeModule } from './type/type.module';
import { FeatureModule } from './feature/feature.module';
import { OrderModule } from './order/order.module';

import {
  AVAILABLE_ROUTES,
  PROTECTED_ROUTES,
} from './constants/routes.constant';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
    AuthModule,
    ProductModule,
    BrandModule,
    TypeModule,
    FeatureModule,
    OrderModule,
    AddressModule,
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
