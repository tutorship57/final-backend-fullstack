import { Provider } from 'src/provider/entities/provider.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type Role = 'user' | 'admin' | 'manager' | 'merchant' | 'editor';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  firstname: string;

  @Column({
    nullable: false,
  })
  lastname: string;

  @Column({
    nullable: true,
  })
  picture_url: string;

  @Column({
    enum: ['user', 'admin', 'manager', 'merchant', 'editor'],
    default: 'user',
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) 
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) 
  updatedAt: Date;

  @OneToOne(() => Provider, (provider) => provider.user)
  provider: Provider;
}
