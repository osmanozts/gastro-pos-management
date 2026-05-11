import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Gastro POS API')
    .setDescription('Restaurant Bestellsystem')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Workspace-Root: apps/api -> ../.. -> root
  const outputPath = resolve(process.cwd(), '../../openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`openapi.json geschrieben: ${outputPath}`);
  await app.close();
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
