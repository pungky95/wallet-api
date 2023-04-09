import {
  Controller,
  Post,
  Body,
  Request,
  Patch,
  Get,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { InitWalletInputDto } from './dto/init-wallet-input.dto';
import { Public } from '../auth/decorators/public.decorator';
import { DepositWalletInputDto } from './dto/deposit-wallet-input.dto';
import { WithdrawWalletInputDto } from './dto/withdraw-wallet-input.dto';
import { DisableWalletInputDto } from './dto/disable-wallet.input.dto';

@Controller('api/v1')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Public()
  @Post('init')
  @HttpCode(HttpStatus.CREATED)
  async init(@Body() initWalletInputDto: InitWalletInputDto) {
    return this.walletService.init(initWalletInputDto);
  }

  @Post('wallet')
  @HttpCode(HttpStatus.CREATED)
  async enable(@Request() req) {
    const { customer_xid } = req;
    if (!customer_xid) {
      throw new HttpException(
        'Customer ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.walletService.enable(customer_xid);
  }

  @Patch('wallet')
  @HttpCode(HttpStatus.OK)
  async disable(
    @Request() req,
    @Body() disableWalletInputDto: DisableWalletInputDto,
  ) {
    const { customer_xid } = req;
    if (!customer_xid) {
      throw new HttpException(
        'Customer ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.walletService.disable(customer_xid, disableWalletInputDto);
  }

  @Get('wallet')
  @HttpCode(HttpStatus.OK)
  async getBalance(@Request() req) {
    const { customer_xid } = req;
    if (!customer_xid) {
      throw new HttpException(
        'Customer ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.walletService.getBalance(customer_xid);
  }

  @Get('wallet/transactions')
  async getTransactions(@Request() req) {
    const { customer_xid } = req;
    if (!customer_xid) {
      throw new HttpException(
        'Customer ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.walletService.getTransactions(customer_xid);
  }

  @Post('wallet/deposits')
  async deposit(
    @Request() req,
    @Body() depositWalletDto: DepositWalletInputDto,
  ) {
    const { customer_xid } = req;
    if (!customer_xid) {
      throw new HttpException(
        'Customer ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.walletService.deposit(customer_xid, depositWalletDto);
  }

  @Post('wallet/withdrawals')
  async withdraw(
    @Request() req,
    @Body() withdrawWalletInputDto: WithdrawWalletInputDto,
  ) {
    const { customer_xid } = req;
    if (!customer_xid) {
      throw new HttpException(
        'Customer ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.walletService.withdraw(customer_xid, withdrawWalletInputDto);
  }
}
