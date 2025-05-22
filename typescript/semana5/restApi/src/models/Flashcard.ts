import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from './Category';
import { FlashcardView } from './FlashcardView';

@Entity('flashcards')
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column('text')
  question: string;

  @Column('text')
  answer: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column('text', { nullable: true })
  image_url: string;

  @ManyToMany(() => Category, category => category.flashcards)
  @JoinTable({
    name: 'flashcard_categories',
    joinColumn: { name: 'flashcard_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => FlashcardView, flashcardView => flashcardView.flashcard)
  views: FlashcardView[];
} 