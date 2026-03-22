import { Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider, ProviderType } from './entities/provider.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ProviderFindOneQuery } from './types/providerQueryFilter';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,
  ) {}

  create(createProviderDto: CreateProviderDto) {
    const { password, user, sub_id, provider } = createProviderDto;
    const createProviderPayload = {
      provider,
      sub_id,
      user: { id: user },
      ...(password && { password }),
    };
    const newProvider = this.providerRepo.create(createProviderPayload);
    return this.providerRepo.save(newProvider);
  }

  findAll() {
    return `This action returns all provider`;
  }

  findOne(filters: ProviderFindOneQuery) {
    if (!filters || Object.keys(filters).length === 0) {
      throw new Error('Where condition is required');
    }
    const { userId, ...rest } = filters;
    return this.providerRepo.findOne({
      where: {
        ...rest,
        user: userId ? { id: userId } : undefined,
      } as FindOptionsWhere<Provider>,
    });
  }

  update(id: number, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  remove(id: number) {
    return `This action removes a #${id} provider`;
  }
}
