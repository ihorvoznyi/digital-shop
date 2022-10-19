import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const type = req.headers['authorization'].split(' ')[0];
    const token = req.headers['authorization'].split(' ')[1];

    if (type.toLowerCase() !== 'bearer' || !token)
      throw new UnauthorizedException('Unauthorized');

    const secret = this.config.get<string>('JWT_SECRET_KEY');

    try {
      req.user = await this.jwtService.verify(token, { secret });
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    next();
  }
}
