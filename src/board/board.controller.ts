import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('users/:user_id/workspace/:workspace_id/boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(
    @Param('workspace_id') workspaceId: string,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardService.create({
      ...createBoardDto,
      workspace_id: workspaceId,
    });
  }

  @Get()
  findAll(
    @Param('workspace_id') workspaceId: string,
    @Param('user_id') userId: string,
  ) {
    return this.boardService.findBoardWorkspace(workspaceId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(id);
  }
}
