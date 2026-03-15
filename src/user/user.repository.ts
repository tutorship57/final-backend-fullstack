import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { UserQueryFilters } from './types/userQueryFilter';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create() {}

  async findAll(filters: UserQueryFilters) {
    const { limit, offset, sortBy, sortOrder } = filters;
    const where: FindOptionsWhere<User> = {};

    if (filters.id) where.id = filters.id;
    if (filters.email) where.email = filters.email;
    if (filters.name) where.name = filters.name;
    if (filters.picture_url) where.picture_url = filters.picture_url;
    if (filters.role) where.role = filters.role;

    let order: FindOptionsOrder<User> = {};

    if (sortBy && sortOrder) {
      order = {
        [sortBy]: sortOrder,
      } as FindOptionsOrder<User>;
    } else {
      order = { createdAt: 'DESC' };
    }

    return await this.userRepo.find({
      where: where,
      order: order,
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: any) {}

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: {
        email: email,
      },
    });
  }
}
