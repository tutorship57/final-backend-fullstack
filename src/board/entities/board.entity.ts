import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { List } from 'src/list/entities/list.entity';
import { WorkspaceRole } from 'src/workspace-role/entities/workspace-role.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  background_url: string;

  @Column()
  workspace_id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Link to the Workspace
  @ManyToOne(() => Workspace, (workspace) => workspace.boards)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];

  @Column({ name: 'required_role_id', nullable: true })
  required_role_id: string;

  @ManyToOne(() => WorkspaceRole)
  @JoinColumn({ name: 'required_role_id' })
  requiredRole: WorkspaceRole;
}
