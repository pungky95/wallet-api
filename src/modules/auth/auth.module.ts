import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { ResponseHelper } from 'src/helper/response.helper';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.JWT_SECRET,
      }),
    }),
  ],
  providers: [AuthService, ResponseHelper],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
