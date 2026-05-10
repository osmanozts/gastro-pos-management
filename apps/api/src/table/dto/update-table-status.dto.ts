import { IsEnum } from 'class-validator';
import { TableStatus } from '../../__generated__/prisma';

export class UpdateTableStatusDto {
  @IsEnum(TableStatus)
  status: TableStatus;
}
