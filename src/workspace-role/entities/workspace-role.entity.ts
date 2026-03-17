import { Permission } from 'src/permission/entities/permission.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('workspace_roles')
export class WorkspaceRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., 'Manager' or 'Moderator'

  @Column()
  workspace_id: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @ManyToMany(() => Permission, (perm) => perm.roles)
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}
