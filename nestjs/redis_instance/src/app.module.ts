import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InstancesModule } from './instances/instances.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstancesController } from './instances/instances.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('db.mysql.host'),
        port: +configService.get('db.mysql.port'),
        username: configService.get('db.mysql.user'),
        password: configService.get('db.mysql.password'),
        database: configService.get('db.mysql.database'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    InstancesModule,
  ],
})
export class AppModule {}
