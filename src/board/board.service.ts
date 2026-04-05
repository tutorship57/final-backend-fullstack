import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository, Brackets } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  // Standard CRUD operations
  create(createBoardDto: CreateBoardDto) {
    const newBoard = this.boardRepo.create(createBoardDto);
    return this.boardRepo.save(newBoard);
  }

  findAll() {
    return this.boardRepo.find();
  }

  findOne(id: string) {
    return this.boardRepo.findOne({
      where: { id },
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    const existBoard = await this.findOne(id);
    if (!existBoard) {
      throw new NotFoundException('Board not found');
    }
    const updated = this.boardRepo.merge(existBoard, updateBoardDto);
    return this.boardRepo.save(updated);
  }

  async remove(id: string) {
    const removed = await this.boardRepo.delete(id);
    if (removed.affected === 0) {
      throw new NotFoundException('Board not found');
    }
    return { id };
  }

  /**
   * Main Function: Orchestrates fetching boards based on complex permissions
   * and formatting them with task counts.
   */
  async findBoardWorkspace(workspaceId: string, userId: string) {
    const { entities, raw } = await this.getBoardsQuery(workspaceId, userId);
    return this.formatBoardsWithTaskCount(entities, raw);
  }

  /**
   * Private Helper: Handles the database query including permission logic
   * (Owner check, "see:all_boards" permission, specific role match, or public boards).
   */
  private async getBoardsQuery(workspaceId: string, userId: string) {
    return await this.boardRepo
      .createQueryBuilder('board')
      // Join workspace to check ownership
      .innerJoin('workspaces', 'workspace', 'workspace.id = board.workspace_id')

      // Join the member and their specific roles
      .leftJoin(
        'workspace_members',
        'member',
        'member.workspace_id = workspace.id AND member.user_id = :userId',
        { userId },
      )
      .leftJoin('member_roles', 'm_role', 'm_role.member_id = member.id')

      // Join the permissions associated with those roles
      .leftJoin(
        'role_permissions',
        'rp',
        'rp.workspaceRolesId = m_role.role_id',
      )
      .leftJoin('permissions', 'perm', 'perm.id = rp.permissionsId')

      // Count tasks for each board via a subquery
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(task.id)', 'taskCount')
          .from('taskCards', 'task')
          .innerJoin('lists', 'list', 'list.id = task.list_id')
          .where('list.board_id = board.id');
      }, 'taskCount')

      .where('board.workspace_id = :workspaceId', { workspaceId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('workspace.owner_id = :userId', { userId }) // 1. Is Owner
            .orWhere('perm.name = :permissionName', {
              permissionName: 'see:all_boards',
            }) // 2. Has Global "See All" Power
            .orWhere('board.required_role_id = m_role.role_id') // 3. User Role matches Board required role
            .orWhere('board.required_role_id IS NULL'); // 4. Board is public to all members
        }),
      )
      .getRawAndEntities();
  }

  /**
   * Private Helper: Maps the TypeORM entities with the raw taskCount values.
   */
  private formatBoardsWithTaskCount(entities: Board[], raw: any[]) {
    return entities.map((board) => {
      // Matches the entity with its raw counterpart containing taskCount
      const rawResult = raw.find((r) => r.board_id === board.id);
      return {
        ...board,
        taskCount: parseInt(rawResult?.taskCount || '0', 10),
      };
    });
  }
}
