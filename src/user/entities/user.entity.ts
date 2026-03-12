import { Provider } from 'src/provider/entities/provider.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
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

  @OneToOne(() => Provider, (provider) => provider.user)
  provider: Provider;
}
