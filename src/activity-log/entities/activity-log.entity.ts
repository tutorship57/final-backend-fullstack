import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  workspace_id: string;

  //   @Column({ type: 'varchar' })
  //   action: string;

  @Column({ type: 'varchar' })
  method: string;

  @Column({ type: 'varchar' })
  route: string;

  @Column({ type: 'int' })
  status_code: number;

  @Column({ type: 'varchar', nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', nullable: true })
  target_type: string;

  @Column({ type: 'uuid', nullable: true })
  target_id: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
