import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app/app.controller.js';
import { AppService } from './app/app.service.js';
import { PartsModule } from './modules/parts/parts.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';

@Module({
  imports: [
    ...(process.env.DB_HOST
      ? [
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: false,
          }),
        ]
      : []),
    PartsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
