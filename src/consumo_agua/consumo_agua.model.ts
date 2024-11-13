import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Consumption extends Document {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  consumption: number;

  @Prop({type: Date, required: true })
  date: Date;
}

export const ConsumptionSchema = SchemaFactory.createForClass(Consumption);

export interface ConsumptionDT {
    userId: number; // Identificador do usuário
    consumption: number;   // Quantidade de água consumida
    date: Date;       // Data da leitura
}

