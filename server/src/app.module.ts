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
import { ValidTokenMiddleware } from './auth/middlewares/valid-token.middleware';
import config from '../typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(ValidTokenMiddleware).forRoutes({
      path: '/auth/auth',
      method: RequestMethod.GET,
    });
  }
}
