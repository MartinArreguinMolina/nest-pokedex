import { Injectable } from '@nestjs/common';
import { PokemonInterfaces } from './interfaces/pokemon.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  

  constructor(
      @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,

      private readonly http: AxiosAdapter
  ){}

  async executeSeed(){

   await this.pokemonModel.deleteMany({});
   const data = await this.http.get<PokemonInterfaces>('https://pokeapi.co/api/v2/pokemon?limit=650');

   const pokemonToInsert: {name: string, no: number}[] = [];

   data.results.forEach(({name, url}) => {
    const segment: string[] = url.split('/');
    const no: number = +segment[segment.length - 2];

    pokemonToInsert.push({name, no});
   })

   await this.pokemonModel.insertMany(pokemonToInsert)


    return 'Seed Executed';
  }
}
