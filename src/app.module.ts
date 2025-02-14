import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';``

import { AppController } from './app.controller';
import { PrismaService } from './prisma.services';
import { UserController } from './user/user.controller';
import { QueryExceptionFilter } from './common/exception-filters/query-exception.filter';
import { LocalStrategy } from './common/strategies/local.strategy';
import { SerializeInterceptor } from './common/interceptors/serialize.interceptor';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      cache: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string(),
      }),
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1year',
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  controllers: [AppController, UserController],
  providers: [
    UserService,
    PrismaService,
    ConfigService,
    JwtStrategy,
    LocalStrategy,
    SerializeInterceptor,

    { provide: APP_FILTER, useClass: QueryExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
