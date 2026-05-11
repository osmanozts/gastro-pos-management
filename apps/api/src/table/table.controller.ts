import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { TableService } from './table.service';

@ApiTags('tables')
@Controller('tables')
@UseGuards(AuthGuard)
export class TableController {
  constructor(private tableService: TableService) {}

  @Get()
  getAll() {
    return this.tableService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.tableService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTableDto) {
    return this.tableService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTableDto) {
    return this.tableService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTableStatusDto) {
    return this.tableService.updateStatus(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tableService.delete(id);
  }
}
