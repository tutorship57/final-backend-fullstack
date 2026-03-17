import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { List } from 'src/list/entities/list.entity';

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

  // Link to the Workspace
  @ManyToOne(() => Workspace, (workspace) => workspace.boards)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];
}
