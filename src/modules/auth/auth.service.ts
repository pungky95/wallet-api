import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseHelper } from '../../helper/response.helper';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(ResponseHelper) private responseHelper: ResponseHelper,
  ) {}

  async initWallet(customer_xid: string) {
    try {
      if (!customer_xid) {
        throw new HttpException(
          { status: 'error', message: 'customer_xid is required' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payload = { customer_xid };
      return this.responseHelper.sendSuccessResponse({
        access_token: await this.jwtService.signAsync(payload),
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        { status: 'error', message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
