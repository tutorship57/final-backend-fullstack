import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export type ProviderType = 'local' | 'google';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['local', 'google'],
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

  @JoinColumn()
  @OneToOne(() => User, (user) => user.provider)
  user: User;
}
