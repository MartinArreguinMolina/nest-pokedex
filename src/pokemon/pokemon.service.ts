import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultlimit: number;

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    //Tenemos que inyectar lo siguiente para que funcione la varibale de entorno
    private readonly configService: ConfigService
  ){
    // console.log(process.env.DEFAULT_LIMIT)
    // Tenemos que utilizar de la siguiente manera la varibale de entorno
    this.defaultlimit = configService.get<number>('defaul_limit')!;
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try{
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch(error){
      this.handleException(error);
    }

  }

  findAll(paginationDto:PaginationDto) {
    const {limit = this.defaultlimit, offset = 0} = paginationDto;

    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)

    // Ordenar por numero y eliminar una columna
    .sort({
      no:1
    })
    .select('-__v')
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    if(!isNaN(+term)){
      // Se le manda un objeto para que busque por numero es decir buscara el no:1 por ejemplo en la base de datos, si encuentra algun con no: 1 no regresa
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    // Mongo ID
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term)
    }

    // Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});
    }

    // Si no se encuentra el valor
    if(!pokemon){
      throw new NotFoundException(`No se encontro el pokemon con el no ${term}`)
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try{
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    }catch(error){
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);

    // // Esto elimina el pokemon obtenido
    // await pokemon.deleteOne();


    // Tambien se puede hacer de la siguiente menera
    // const result = await this.pokemonModel.findByIdAndDelete(id);


    // La manera mas eficiente es de la siguiente manera
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id ${id} not found`)
    }

    return;
  }

  private handleException(error: any){
    if(error.code === 11000){
        throw new BadRequestException(`El pokemon con el ${JSON.stringify(error.keyValue)} ya existe`)
      }

      console.log(error)
      throw new InternalServerErrorException(`Cant't create Pokemon - Check server log`)
  }
}
