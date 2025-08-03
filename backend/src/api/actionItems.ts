import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database';
import { ActionItem, CreateActionItemDto, UpdateActionItemDto } from '../models/ActionItem';

const router = Router();

// Get all action items with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, priority, assignee, search, category } = req.query;
    
    let items: ActionItem[];
    
    // Check if filtering by category
    if (category && (category === 'personal' || category === 'professional')) {
      items = await db.getByCategory(category as 'personal' | 'professional');
    } else {
      items = await db.getAll();
    }
    
    // Apply filters
    if (status) {
      items = items.filter(item => item.status === status);
    }
    if (priority) {
      items = items.filter(item => item.priority === priority);
    }
    if (assignee) {
      items = items.filter(item => item.assignee === assignee);
    }
    if (search) {
      items = await db.search(search as string);
      // If category filter was applied, filter search results by category
      if (category && (category === 'personal' || category === 'professional')) {
        items = items.filter(item => item.category === category);
      }
    }
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch action items' });
  }
});

// Get single action item
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await db.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Action item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch action item' });
  }
});

// Create new action item
router.post('/', async (req: Request, res: Response) => {
  try {
    const createDto: CreateActionItemDto = req.body;
    const now = new Date().toISOString();
    
    const newItem: ActionItem = {
      id: uuidv4(),
      ...createDto,
      status: createDto.status || 'todo',
      priority: createDto.priority || 'medium',
      category: createDto.category || 'personal',
      for_whom: createDto.for_whom,
      created_at: now,
      updated_at: now
    };
    
    await db.create(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create action item' });
  }
});

// Update action item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updateDto: UpdateActionItemDto = req.body;
    const existing = await db.getById(req.params.id);
    
    if (!existing) {
      return res.status(404).json({ error: 'Action item not found' });
    }
    
    const updates = {
      ...updateDto,
      updated_at: new Date().toISOString()
    };
    
    await db.update(req.params.id, updates);
    const updated = await db.getById(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update action item' });
  }
});

// Update status only
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['todo', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const existing = await db.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Action item not found' });
    }
    
    await db.update(req.params.id, {
      status,
      updated_at: new Date().toISOString()
    });
    
    const updated = await db.getById(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Update category only
router.patch('/:id/category', async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    
    if (!['personal', 'professional'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    const existing = await db.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Action item not found' });
    }
    
    await db.update(req.params.id, {
      category,
      updated_at: new Date().toISOString()
    });
    
    const updated = await db.getById(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete action item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const existing = await db.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Action item not found' });
    }
    
    await db.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete action item' });
  }
});

export default router;