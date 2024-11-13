import { Body, Controller, Post, HttpException, HttpStatus, Get, Param } from '@nestjs/common';
import { ConsumoAguaService } from './consumo_agua.service';
import { Consumption, ConsumptionDT } from './consumo_agua.model';

@Controller('consumo-agua')
export class ConsumoAguaController {
  constructor(private readonly consumoService: ConsumoAguaService) {}

  @Post()
  async registerConsumption(@Body() consumption: ConsumptionDT): Promise<any> {
    try {
      console.log('Recebendo dados: ', consumption)
      const resultado = await this.consumoService.register(consumption);
      console.log('Resultado da gravação:', resultado);
      return { 
        Message: 'Consumo registrado!',
        Consumption: resultado,
      };
    } catch (error) {
      console.error('Erro ao registrar consumo:', error)
      throw new HttpException('Erro ao registrar consumo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:userId/:startDate/:endDate')
  async getHistory(
    @Param('userId') userId: number, 
    @Param('startDate') startDate: string, 
    @Param('endDate') endDate: string
  ): Promise<any> {
    try {
      const resultado = await this.consumoService.getHistory(userId, new Date(startDate), new Date(endDate));
      
      // Removendo o formato da data
      return { resultado }; // Retorna o resultado original
    } catch (error) {
      throw new HttpException('Erro ao obter histórico', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/alert/:userId')
  async getAlerts(@Param('userId') userId: number) {
    try {
      const alerts = await this.consumoService.getAlertas(userId);
      return { alerts };
    } catch (error) {
      throw new HttpException('Erro ao obter alertas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/users')
  async getAllConsumptions(): Promise<any> {
    try {
      const users = await this.consumoService.getAllUsers();
      return { users };
    } catch (error) {
      throw new HttpException('Erro ao obter todos os consumos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
