import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rating } from './rating.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  overview: string;

  @Column()
  releaseDate: Date;

  @Column({ type: 'json' })
  genres: string[];

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];
}
