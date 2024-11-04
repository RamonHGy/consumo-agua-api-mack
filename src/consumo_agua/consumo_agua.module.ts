import { Module } from '@nestjs/common';
import { ConsumoAguaController } from './consumo_agua.controller';
import { ConsumoAguaService } from './consumo_agua.service';
import { Mongoose } from 'mongoose';
import { MongooseModule} from '@nestjs/mongoose';
import { Consumption, ConsumptionSchema } from './consumo_agua.model';

@Module({
  imports:[MongooseModule.forFeature([{name: Consumption.name, schema: ConsumptionSchema}]) ],
  controllers: [ConsumoAguaController],
  providers: [ConsumoAguaService]
})
export class ConsumoAguaModule {}
