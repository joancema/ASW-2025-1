export interface CreateFlashcardDTO {
  question: string;
  answer: string;
  image_url?: string;
  categoryIds?: number[];
}

export interface UpdateFlashcardDTO {
  question?: string;
  answer?: string;
  image_url?: string;
  categoryIds?: number[];
} 