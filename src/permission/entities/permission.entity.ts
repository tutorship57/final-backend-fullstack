import { WorkspaceRole } from 'src/workspace-role/entities/workspace-role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // e.g., 'workspace:invite', 'board:delete'

  @ManyToMany(() => WorkspaceRole, (role) => role.permissions)
  roles: WorkspaceRole[];
}
