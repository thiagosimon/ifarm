import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CommissionModule } from './commission/commission.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { HealthModule } from './health/health.module';
import { Commission } from './commission/entities/commission.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URI || 'postgres://ifarm:ifarm123@localhost:5432/ifarm_commission',
      entities: [Commission],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    BullModule.forRoot({
      connection: (() => {
        const url = new URL(process.env.REDIS_URL || 'redis://localhost:6379');
        return {
          host: url.hostname,
          port: parseInt(url.port || '6379', 10),
          ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
        };
      })(),
    }),
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
    }),
    CommissionModule,
    RabbitmqModule,
    HealthModule,
  ],
})
export class AppModule {}
