import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const isDev = process.env.NODE_ENV !== 'production';

  // Swagger UI benötigt inline scripts — CSP in dev deaktivieren
  app.use(helmet({ contentSecurityPolicy: !isDev }));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('Gastro POS API')
      .setDescription('Restaurant Bestellsystem')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(3000);
}
bootstrap();
