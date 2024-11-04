import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumoAguaModule } from './consumo_agua/consumo_agua.module';

@Module({
  imports: [ConsumoAguaModule, MongooseModule.forRoot('mongodb+srv://webmobilea8:12Paoeovo.@cluster0.mizpw.mongodb.net/test')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
