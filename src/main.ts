import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      // La siguiente configuracion es pora que los QueryParameters sean tranformados a su interfaz correspodiente o a sus valores correspondientes
      // Es decir si mandar un numero que sea un numero o asi suvesivameante
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  // Este comando pone una ruta ya definida antes que las demas
  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT!);
}
bootstrap();
