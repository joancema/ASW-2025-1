import { Category } from '../models/Category';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../models/CategoryDTO';
import { AppDataSource } from '../database/database';

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    const newCategory = this.categoryRepository.create(data);
    return this.categoryRepository.save(newCategory);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['flashcards'] });
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id: BigInt(id) }, relations: ['flashcards'] });
  }

  async updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category | null> {
    const category = await this.getCategoryById(id);
    if (!category) return null;

    this.categoryRepository.merge(category, data);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Consider consequences: deleting a category might affect flashcards associated with it.
    // TypeORM's onDelete: 'cascade' in FlashcardCategories join table handles this by deleting join table entries.
    // If direct flashcards should be deleted or unlinked, additional logic is needed here.
    const result = await this.categoryRepository.delete(String(id));
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
} 