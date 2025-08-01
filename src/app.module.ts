import { Module } from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({

  imports: [

    // Esto sirve para configurar las variables de entorno

    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema
    }),

    // Esto sirve para poner el contenido statico de mi aplicacion de nest
    // Este contenido se encuentra en la carpeta public
    ServeStaticModule.forRoot({
        rootPath: join(__dirname,'..','public'),
    }),
    
    // Base de datos de mongo
    MongooseModule.forRoot(process.env.MONGODB!,
      {
        dbName: 'pokemonsdb'
      }
    ),

    PokemonModule,

    CommonModule,

    SeedModule 
  ],
})
export class AppModule {
  constructor(){
    // console.log(process.env)
  }
}