import { Controller, Get } from '@nestjs/common';
import { DadoVeiculo, FipeService } from '../services/app.service';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Controller()
export class AppController {
  constructor(private readonly fipeService: FipeService) {}

  @Get('marcas')
  async getMarcas(): Promise<any> {
    // const result = this.fipeService.getMarcas();
    const result = await this.fipeService.fetchDataAndStore();
    // console.log(result);
    
    let resultWithPrice: DadoVeiculo[][] = await this.fipeService.byCodigo(result);
    // console.log(resultWithPrice);
    
    

    let diferencasDePrecoPorConjunto = resultWithPrice.map((dados) => {
      const diferencas = this.fipeService.calcularDiferencasDePreco(dados);
      return diferencas;
    });
    diferencasDePrecoPorConjunto[0].reverse();
    // console.log(diferencasDePrecoPorConjunto);
    
    

    const dadosVeiculosComNomes = resultWithPrice.map((conjuntoVeiculos, index) => {
        return conjuntoVeiculos.reverse().map((veiculo, subIndex) => ({
          ...veiculo,
          DiferencaAnoAnterior: diferencasDePrecoPorConjunto[index][subIndex]
        }));
      }
    );
    
    return dadosVeiculosComNomes;
  }

  // @Get()
  // getFipe(): any {
  //   const teste =  this.appService.findAll();
  //   console.log(teste);
  //   return teste;
    
  // }
}
