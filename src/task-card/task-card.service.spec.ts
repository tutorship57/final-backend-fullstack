import { Test, TestingModule } from '@nestjs/testing';
import { TaskCardService } from './task-card.service';

describe('TaskCardService', () => {
  let service: TaskCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskCardService],
    }).compile();

    service = module.get<TaskCardService>(TaskCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
