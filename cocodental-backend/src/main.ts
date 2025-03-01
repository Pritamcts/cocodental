import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, {
  //   httpsOptions: {
  //     key: fs.readFileSync(join(__dirname, '..', 'certs', 'server.key')),
  //     cert: fs.readFileSync(join(__dirname, '..', 'certs', 'server.crt')),
  //   },
  // });
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
