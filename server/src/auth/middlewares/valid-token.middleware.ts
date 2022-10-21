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
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const type: string = req.headers['authorization'].split(' ')[0];
    const token: string = req.headers['authorization'].split(' ')[1];

    if (type.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const secret = this.config.get<string>('JWT_SECRET_KEY');

    try {
      req.user = (await this.jwtService.verify(token, { secret })) as IAuth;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    next();
  }
}
