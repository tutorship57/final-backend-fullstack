import { List } from 'src/list/entities/list.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('taskCards')
export class TaskCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  list_id: string;

  // Link back to the list
  @ManyToOne(() => List, (list) => list.taskCards)
  @JoinColumn({ name: 'list_id' }) // Matches your DB column name
  list: List;
}
