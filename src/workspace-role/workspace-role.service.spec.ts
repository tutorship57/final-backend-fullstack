import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceRoleService } from './workspace-role.service';

describe('WorkspaceRoleService', () => {
  let service: WorkspaceRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceRoleService],
    }).compile();

    service = module.get<WorkspaceRoleService>(WorkspaceRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
