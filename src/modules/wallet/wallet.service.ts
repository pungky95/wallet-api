import { HttpException, Injectable, Inject } from '@nestjs/common';
import { InitWalletInputDto } from './dto/init-wallet-input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../../entities/wallet.entity';
import { Repository, DataSource } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { HttpStatus } from '@nestjs/common';
import { WalletStatus } from 'src/enum/wallet-status';
import { DepositWalletInputDto } from './dto/deposit-wallet-input.dto';
import { Transaction } from 'src/entities/transaction.entity';
import { WithdrawWalletInputDto } from './dto/withdraw-wallet-input.dto';
import { TransactionStatus } from 'src/enum/transaction-status.enum';
import { TransactionType } from 'src/enum/transaction-type.enum';
import { WithdrawWalletResponseDto } from './dto/withdraw-wallet-response.dto';
import { DepositWalletResponseDto } from './dto/deposit-wallet-response.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';
import { ResponseHelper } from '../../helper/response.helper';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { DisableWalletInputDto } from './dto/disable-wallet.input.dto';

@Injectable()
export class WalletService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly authService: AuthService,
    @Inject(ResponseHelper) private responseHelper: ResponseHelper,
  ) {}
  async init(
    initWalletInputDto: InitWalletInputDto,
  ): Promise<{ status: string; data: { access_token: string } }> {
    try {
      const { customer_xid: customerId } = initWalletInputDto;
      const walletExists = await this.walletRepository.findOne({
        where: { customerId },
      });
      if (walletExists) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet already exists' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      const wallet = this.walletRepository.create({
        customerId,
        status: WalletStatus.DISABLED,
        enabledAt: new Date(),
        balance: 0,
      });
      await this.walletRepository.save(wallet);
      return this.authService.initWallet(customerId);
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
  async enable(
    customerId: string,
  ): Promise<{ status: string; data: { wallet: Wallet } }> {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { customerId },
      });
      if (!wallet) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet not found' } },
          HttpStatus.NOT_FOUND,
        );
      }
      if (wallet.status === WalletStatus.ENABLED) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Already enabled' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      wallet.status = WalletStatus.ENABLED;
      await this.walletRepository.save(wallet);
      const walletResponseDto: WalletResponseDto = {
        id: wallet.id,
        owned_by: wallet.customerId,
        status: wallet.status,
        enabled_at: wallet.enabledAt,
        balance: wallet.balance,
      };
      return this.responseHelper.sendSuccessResponse({
        wallet: walletResponseDto,
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

  async disable(
    customerId: string,
    disableWalletInputDto: DisableWalletInputDto,
  ): Promise<{ status: string; data: { wallet: Wallet } }> {
    try {
      const { is_disabled } = disableWalletInputDto;
      if (is_disabled === false) {
        throw new HttpException(
          { status: 'fail', data: { error: 'is_disabled should be true' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      const wallet = await this.walletRepository.findOne({
        where: { customerId },
      });
      if (!wallet) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet not found' } },
          HttpStatus.NOT_FOUND,
        );
      }
      if (wallet.status === WalletStatus.DISABLED) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Already disabled' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      wallet.status = WalletStatus.DISABLED;
      await this.walletRepository.save(wallet);
      return { status: 'success', data: { wallet } };
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

  async getBalance(
    customerId: string,
  ): Promise<{ status: string; data: { wallet: Wallet } }> {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { customerId },
      });
      if (!wallet) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet not found' } },
          HttpStatus.NOT_FOUND,
        );
      }
      if (wallet.status === WalletStatus.DISABLED) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet disabled' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      const walletResponseDto: WalletResponseDto = {
        id: wallet.id,
        owned_by: wallet.customerId,
        status: wallet.status,
        enabled_at: wallet.enabledAt,
        balance: wallet.balance,
      };
      return this.responseHelper.sendSuccessResponse({
        wallet: walletResponseDto,
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

  async getTransactions(
    customerId,
  ): Promise<{ status: string; data: { transactions: Transaction[] } }> {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { customerId },
        relations: ['transactions'],
      });
      if (!wallet) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet not found' } },
          HttpStatus.NOT_FOUND,
        );
      }
      if (wallet.status === WalletStatus.DISABLED) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet disabled' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      const transactions = wallet.transactions.map((transaction) => {
        const transactionResponseDto: TransactionResponseDto = {
          id: transaction.id,
          status: transaction.status,
          transacted_at: transaction.createdAt,
          type: transaction.type,
          amount: transaction.amount,
          reference_id: transaction.referenceId,
        };
        return transactionResponseDto;
      });
      return this.responseHelper.sendSuccessResponse({ transactions });
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

  async deposit(
    customerId: string,
    depositWalletInputDto: DepositWalletInputDto,
  ): Promise<{ status: string; data: { deposit: DepositWalletResponseDto } }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { amount, reference_id: referenceId } = depositWalletInputDto;
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { customerId },
      });
      if (!wallet) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet not found' } },
          HttpStatus.NOT_FOUND,
        );
      }
      if (wallet.status === WalletStatus.DISABLED) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet disabled' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      wallet.balance += amount;
      const transaction = queryRunner.manager.create(Transaction, {
        amount,
        referenceId,
        walletId: wallet.id,
        status: TransactionStatus.SUCCESS,
        type: TransactionType.DEPOSIT,
      });
      await queryRunner.manager.save(Transaction, transaction);
      await queryRunner.manager.save(Wallet, wallet);
      await queryRunner.commitTransaction();
      const depositWalletResponse: DepositWalletResponseDto = {
        id: transaction.id,
        deposited_by: customerId,
        status: transaction.status,
        deposited_at: transaction.createdAt,
        amount: transaction.amount,
        reference_id: transaction.referenceId,
      };
      return {
        status: 'success',
        data: { deposit: depositWalletResponse },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        { status: 'error', message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(
    customerId: string,
    withdrawWalletInputDto: WithdrawWalletInputDto,
  ): Promise<{
    status: string;
    data: { withdraw: WithdrawWalletResponseDto };
  }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { amount, reference_id: referenceId } = withdrawWalletInputDto;
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { customerId },
      });
      if (!wallet) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet not found' } },
          HttpStatus.NOT_FOUND,
        );
      }
      if (wallet.status === WalletStatus.DISABLED) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Wallet disabled' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (wallet.balance < amount) {
        throw new HttpException(
          { status: 'fail', data: { error: 'Insufficient balance' } },
          HttpStatus.BAD_REQUEST,
        );
      }
      wallet.balance -= amount;
      const transaction = queryRunner.manager.create(Transaction, {
        amount,
        referenceId,
        walletId: wallet.id,
        status: TransactionStatus.SUCCESS,
        type: TransactionType.WITHDRAWAL,
      });
      await queryRunner.manager.save(Transaction, transaction);
      await queryRunner.manager.save(Wallet, wallet);
      await queryRunner.commitTransaction();
      const withdrawWalletResponse: WithdrawWalletResponseDto = {
        id: transaction.id,
        withdrawn_by: customerId,
        status: transaction.status,
        withdrawn_at: transaction.createdAt,
        amount: transaction.amount,
        reference_id: transaction.referenceId,
      };
      return { status: 'success', data: { withdraw: withdrawWalletResponse } };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        { status: 'error', message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
