import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Board } from 'src/board/entities/board.entity';
import { TaskCard } from 'src/task-card/entities/task-card.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int', default: 0 })
  order: number; // Used for drag-and-drop sorting

  @Column()
  board_id: string;

  @ManyToOne(() => Board, (board) => board.lists)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => TaskCard, (taskCard) => taskCard.list)
  taskCards: TaskCard[];
}
