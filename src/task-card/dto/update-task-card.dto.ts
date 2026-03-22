import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskCardDto } from './create-task-card.dto';

export class UpdateTaskCardDto extends PartialType(CreateTaskCardDto) {}
