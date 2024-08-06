import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DadoVeiculo {
  Valor: string;
  AnoModelo: number;
  TipoVeiculo: number;
  Marca: string,
  Modelo: string;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
  DiferencaAnoAnterior: number;
}

@Injectable()
export class FipeService {
  constructor(private readonly httpService: HttpService) { }

  extrairValorNumerico(valor: string): number {
    const valorNumerico = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
    return isNaN(valorNumerico) ? 0 : valorNumerico;
  }

  calcularDiferencasDePreco(dados: DadoVeiculo[]): number[] {
    const diferencas: number[] = [];

    // Ordenar os dados por ano (do mais antigo para o mais recente)
    dados.sort((a, b) => a.AnoModelo - b.AnoModelo);

    // Calcular a diferença de preço entre anos consecutivos
    for (let i = 1; i < dados.length; i++) {
      const valorAnoAtual = this.extrairValorNumerico(dados[i].Valor);
      const valorAnoAnterior = this.extrairValorNumerico(dados[i - 1].Valor);
      const diferenca = valorAnoAtual - valorAnoAnterior;
      diferencas.push(diferenca);
    }

    return diferencas;
  }

  // getMarcas(): Observable<AxiosResponse<any>> {
  getMarcas(): any {
    const url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/56/modelos/2230/anos';
    let array: any[] = [];
    const result = this.httpService.get(url).subscribe((res) => console.log(res.data));
    // console.log(result);

    //     Retorna os anos para marcas: https://parallelum.com.br/fipe/api/v2/cars/brands/48/years
    // Retorna os modelos para o ano: https://parallelum.com.br/fipe/api/v2/cars/brands/48/years/2018-1/models

    return result;

    // const resultFormatted = this.byCodigo(url, result[0].codigo);
    // const resultFormatted = result.forEach(response => this.byCodigo(url, response.codigo));
    // console.log(resultFormatted);
    // return resultFormatted;

    // return this.httpService.get(url).pipe(map(response => response.data));
  }

  async fetchDataAndStore(): Promise<any> {
    const url = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/56/modelos/2230/anos';
    const array = [];

    await this.httpService.get(url).toPromise().then((response) => {
      array.push(response.data); // Adicionar os dados ao array
    }).catch((error) => {
      console.error('Erro ao obter dados:', error);
    });
    
    return array[0];
  }
  // const resultFull: any = formatData.map(
  //   ({ id_specialty_type, name, type_slug, icon_reference = 'marker' }) => {
  //     const resultFim = {
  //       id: id_specialty_type,
  //       name,
  //       slug: type_slug,
  //       icon_reference,
  //     };
  //     return resultFim;
  //   },
  // );
  async byCodigo(array: any): Promise<any[]> {
    const requests = array.map(async (arrayFim) => {
      try {
        const response = await this.httpService.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/56/modelos/2230/anos/${arrayFim.codigo}`).toPromise();
        return response.data;
      } catch (error) {
        console.error(`Erro ao obter dados para o código ${arrayFim.codigo}:`, error);
        return null; // Ou outro valor que você queira retornar em caso de erro
      }
    });

    const results = await Promise.all(requests);
    return [results.filter(result => result !== null)]; // Filtra os resultados para remover possíveis valores nulos
  }
  // async byCodigo(array: any): Promise<any[]> {
  //   let teste = [];
  //   array.map(arrayFim => {
  //     this.httpService.get("https://parallelum.com.br/fipe/api/v1/carros/marcas/56/modelos/2230/anos/" + arrayFim.codigo).toPromise().then((response) => {
  //       teste.push(response.data);
  //       console.log("https://parallelum.com.br/fipe/api/v1/carros/marcas/56/modelos/2230/anos/" + arrayFim.codigo);
  //       console.log(response);

  //     }).catch((error) => {
  //       console.error('Erro ao obter dados:', error);
  //     });
  //   })
  //   console.log(teste);

  //   return teste;

  //   // return await this.httpService.get(array.url + array.codigo).pipe(map(response => response.data));
  // }
}
