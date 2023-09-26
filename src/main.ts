import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core'; // Import NestFactory

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with the origin(s) you want to allow
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable credentials if needed
  });
  await app.listen(3000);
}

bootstrap();
