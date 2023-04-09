import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseHelper {
  public sendSuccessResponse(data: any): any {
    return {
      status: 'success',
      data: data,
    };
  }
}
