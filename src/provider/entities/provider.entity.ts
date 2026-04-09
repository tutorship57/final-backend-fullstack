import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProviderType = 'local' | 'google' | 'github' | 'facebook';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    default: 'local',
    enum: ['local', 'google', 'github', 'facebook'],
  })
  provider: ProviderType;

  @Column({
    nullable: true,
  })
  sub_id: string;

  @Column({
    nullable: true,
  })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  refresh_token: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.provider)
  user: User;
}
