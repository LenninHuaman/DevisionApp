import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45, unique: true })
  name: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'int' })
  collaborators: number;

  @Column({ nullable: true })
  ambassador?: string;

  @ManyToOne(() => Division, (division) => division.subs, { nullable: true })
  @JoinColumn({ name: 'superior_id' })
  superior: Division | null;

  @OneToMany(() => Division, (division) => division.superior, { nullable: true })
  subs?: Division[];
}
