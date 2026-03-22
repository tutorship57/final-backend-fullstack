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
}
