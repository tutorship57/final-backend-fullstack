import { Provider } from 'src/provider/entities/provider.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../types/role';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  picture_url: string;

  @Column({
    enum: ['user', 'admin', 'manager', 'merchant', 'editor'],
    default: 'user',
  })
  role: RoleEnum;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => Provider, (provider) => provider.user)
  provider: Provider;
}
