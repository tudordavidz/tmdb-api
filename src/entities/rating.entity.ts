import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // User ID (e.g., 'user123')

  @Column({ type: 'float' })
  rating: number; // Rating value (1-5)

  @ManyToOne(() => Movie, (movie) => movie.ratings, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column({ type: 'int', nullable: false }) // Add a movieId column for easier querying
  movieId: number;
}
