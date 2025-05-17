import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../models/CategoryDTO';

export class CategoryController {
  private categoryService = new CategoryService();

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const createCategoryDTO: CreateCategoryDTO = req.body;
      if (!createCategoryDTO.name) {
        res.status(400).json({ message: 'Category name is required' });
        return;
      }
      const newCategory = await this.categoryService.createCategory(createCategoryDTO);
      res.status(201).json(newCategory);
    } catch (error: any) {
      if (error.code === '23505') { // Unique constraint violation for name
        res.status(409).json({ message: 'Category name already exists' });
      } else {
        res.status(500).json({ message: 'Error creating category', error: error.message });
      }
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error: (error as Error).message });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid category ID' });
        return;
      }
      const category = await this.categoryService.getCategoryById(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category', error: (error as Error).message });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid category ID' });
        return;
      }
      const updateCategoryDTO: UpdateCategoryDTO = req.body;
      if (Object.keys(updateCategoryDTO).length === 0) {
        res.status(400).json({ message: 'No update data provided' });
        return;
      }
      const updatedCategory = await this.categoryService.updateCategory(id, updateCategoryDTO);
      if (updatedCategory) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error: any) {
       if (error.code === '23505') { // Unique constraint violation for name
        res.status(409).json({ message: 'Category name already exists' });
      } else {
        res.status(500).json({ message: 'Error updating category', error: error.message });
      }
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid category ID' });
        return;
      }
      const success = await this.categoryService.deleteCategory(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Category not found or could not be deleted' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error: (error as Error).message });
    }
  };
} 