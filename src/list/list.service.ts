import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newList = this.listRepository.create(createListDto);
    return this.listRepository.save(newList);
  }

  findAll() {
    return this.listRepository.find();
  }

  findOne(id: string) {
    return this.listRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  async update(id: string, updateListDto: UpdateListDto) {
    const existedList = await this.findOne(id);
    if (!existedList) {
      throw new NotFoundException();
    }
    const updated = this.listRepository.merge(existedList, updateListDto);

    return this.listRepository.save(updated);
  }

  async remove(id: string) {
    const removed = await this.listRepository.delete(id);
    if (removed.affected === 0) {
      throw new NotFoundException();
    }
    return { id };
  }

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
