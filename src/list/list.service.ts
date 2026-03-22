import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}
  create(createListDto: CreateListDto) {
    return 'This action adds a new list';
  }

  findAll() {
    return `This action returns all list`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }

  //GET: List with Task
  async getListsWithTasks(boardId: string) {
    return await this.listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.taskCards', 'taskCard')
      .where('list.board_id = :boardId', { boardId })
      .orderBy('list.order', 'ASC')
      .addOrderBy('taskCard.order', 'ASC') // Explicitly orders the joined table
      .getMany();
  }
}
