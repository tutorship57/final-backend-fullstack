import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { userFindOneQuery, UserQueryFilters } from './types/userQueryFilter';
import { RoleEnum } from './types/role';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async findAll(filters: UserQueryFilters = {}, role: RoleEnum, id: string) {
    return await this.userRepository.findAll(filters);
  }

  async findOne(where: userFindOneQuery) {
    if (!where || Object.keys(where).length === 0) {
      throw new Error('Where condition is required');
    }
    return await this.userRepository.findOne(where);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
