import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceRoleController } from './workspace-role.controller';
import { WorkspaceRoleService } from './workspace-role.service';

describe('WorkspaceRoleController', () => {
  let controller: WorkspaceRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceRoleController],
      providers: [WorkspaceRoleService],
    }).compile();

    controller = module.get<WorkspaceRoleController>(WorkspaceRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
