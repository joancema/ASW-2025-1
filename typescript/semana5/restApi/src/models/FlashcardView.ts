import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Flashcard } from './Flashcard';

@Entity('flashcard_views')
export class FlashcardView {
  @PrimaryGeneratedColumn()
  id: bigint;

  @ManyToOne(() => Flashcard, flashcard => flashcard.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flashcard_id' })
  flashcard: Flashcard;

  @Column({ type: 'bigint' })
  flashcard_id: bigint;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  viewed_at: Date;
} 