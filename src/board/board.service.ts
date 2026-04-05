import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  create(createBoardDto: CreateBoardDto) {
    const newBoard = this.boardRepo.create(createBoardDto);
    return this.boardRepo.save(newBoard);
  }

  findAll() {
    return this.boardRepo.find();
  }

  findOne(id: string) {
    return this.boardRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    const existBoard = await this.findOne(id);
    if (!existBoard) {
      throw new NotFoundException();
    }
    const updated = this.boardRepo.merge(existBoard, updateBoardDto);
    return this.boardRepo.save(updated);
  }

  async remove(id: string) {
    const removed = await this.boardRepo.delete(id);

    if (removed.affected === 0) {
      throw new NotFoundException();
    }
    return { id };
  }

  // 1. Main Function: Only responsible for orchestrating the flow
  async findBoardWorkspace(workspaceId: string, userId: string) {
    const { entities, raw } = await this.getBoardsQuery(workspaceId, userId);

    return this.formatBoardsWithTaskCount(entities, raw);
  }

  // 2. Private Helper: Only responsible for the database query
  private async getBoardsQuery(workspaceId: string, userId: string) {
    return await this.boardRepo
      .createQueryBuilder('board')
      .innerJoin('workspaces', 'workspace', 'workspace.id = board.workspace_id')
      .leftJoin(
        'workspace_members',
        'member',
        'member.workspace_id = workspace.id AND member.user_id = :userId',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(task.id)', 'taskCount')
          .from('taskCards', 'task')
          .innerJoin('lists', 'list', 'list.id = task.list_id')
          .where('list.board_id = board.id');
      }, 'taskCount')
      .where('board.workspace_id = :workspaceId', { workspaceId })
      .andWhere('(workspace.owner_id = :userId OR member.id IS NOT NULL)', {
        userId,
      })
      .getRawAndEntities();
  }

  // 3. Private Helper: Only responsible for formatting the data
  private formatBoardsWithTaskCount(entities: Board[], raw: any[]) {
    return entities.map((board) => {
      const rawResult = raw.find((r) => r.board_id === board.id);
      return {
        ...board,
        taskCount: parseInt(rawResult?.taskCount || '0', 10),
      };
    });
  }
}
