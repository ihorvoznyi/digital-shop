import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

import { IAuth } from '../interfaces/auth.interface';

@Injectable()
export class ValidTokenMiddleware implements NestMiddleware {
  readonly secret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.secret = this.config.get<string>('JWT_SECRET_KEY');
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req.headers['authorization'].split(' ')[1];
      const secret = this.secret;

      req.user = (await this.jwtService.verify(token, {
        secret,
      })) as IAuth;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    next();
  }
}
