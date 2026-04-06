import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEnum } from './types/role';
import { UserQueryFilters, userFindOneQuery } from './types/userQueryFilter';
import { UserRepository } from './user.repository';

// user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }

  async findAll(filters: UserQueryFilters = {}, role: RoleEnum, id: string) {
    // You can add logic here to restrict users to only seeing their own data if not admin
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ id });
    if (!user) throw new Error('User not found');

    // Pass the update to the repository
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ id });
    if (!user) throw new Error('User not found');

    return await this.userRepository.delete(id);
  }
}
