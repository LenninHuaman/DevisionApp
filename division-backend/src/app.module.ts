import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DivisionModule } from './division/division.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Division } from './division/division';
import { DataSource } from 'typeorm';
import { seedDivisions } from './utils/seeder';

@Module({
  imports: [
    DivisionModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Division],
      //TODO: change to false for deploy
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    await seedDivisions(this.dataSource);
  }
}
