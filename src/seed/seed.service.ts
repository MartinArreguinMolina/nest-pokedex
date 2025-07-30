import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokemonInterfaces } from './interfaces/pokemon.interface';

@Injectable()
export class SeedService {
  
  private readonly axios: AxiosInstance = axios;

  constructor(){

  }

  async executeSeed(){
    
   const {data} = await this.axios.get<PokemonInterfaces>('https://pokeapi.co/api/v2/pokemon?limit=650');

   data.results.forEach(({name, url}) => {
    const segment: string[] = url.split('/');
    const no: number = +segment[segment.length - 2];

    console.log({name, no})
   })


    return data.results;
  }
}
