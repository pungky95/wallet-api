import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../config.service';
import { ConfigModule } from '../config.module';
import { NODE_ENVIRONMENT } from '../../constants/node-environment';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction } from '../../entities/transaction.entity';

const dbUrl = new URL(process.env.DATABASE_URL);
const routingId = dbUrl.searchParams.get('options');
dbUrl.searchParams.delete('options');
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'cockroachdb',
        url: dbUrl.toString(),
        entities: [Wallet, Transaction],
        useUTC: true,
        logging:
          config.NODE_ENV === NODE_ENVIRONMENT.DEVELOPMENT ? 'all' : false,
        ssl: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
