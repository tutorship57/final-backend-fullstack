import { Permission } from 'src/permission/entities/permission.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('workspace_roles')
export class WorkspaceRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  workspace_id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @ManyToMany(() => Permission, (perm) => perm.roles)
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}
