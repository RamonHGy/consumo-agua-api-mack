import { Injectable } from '@nestjs/common';
import { Consumption, ConsumptionDT } from './consumo_agua.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConsumoAguaService {
    constructor(@InjectModel(Consumption.name) private readonly consumptionModel: Model<Consumption>) {}

    async register(consumption: ConsumptionDT) {
        const consumptionModel = new this.consumptionModel({
            userId: consumption.userId,
            consumption: consumption.consumption,
            date: new Date(consumption.date),
        });
        const result = await consumptionModel.save();
        return result;
    }

    async getAllUsers() {
        const users = await this.consumptionModel.find().exec();
        return users.map(user => ({
            ...user.toObject(),
            date: user.date
        }));
    }
    
    async getHistory(userId: number, startDate: Date, endDate: Date): Promise<ConsumptionDT[]> {
        const result = await this.consumptionModel.find({
          userId,
          date: { $gte: startDate, $lte: endDate }
        }).lean();
      
        console.log("Resultado da consulta:", result); 
        return result; 
      }
      

    async getAlertas(userId: number) {
        const consumos = await this.consumptionModel.find({ userId }).sort({ date: -1 }).exec();
    
        
        if (consumos.length < 2) {
            return { message: 'Não há dados suficientes para comparação.' };
        }
    
        const mesAtual = consumos[0]; 
        const mesAnterior = consumos[1]; 
    
        if (mesAtual.consumption > mesAnterior.consumption) {
            return {
                message: `Alerta: Seu consumo atual (${mesAtual.consumption}) é maior que o do último mês registrado (${mesAnterior.consumption}).`
            };
        } else {
            return {
                message: 'Consumo dentro dos limites normais.'
            };
        }
    }
}
