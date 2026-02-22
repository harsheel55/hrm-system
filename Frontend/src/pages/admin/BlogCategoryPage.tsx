import { useState, useEffect } from 'react';
import { blogCategoryService } from '../../services/blog.service';
import type { BlogCategoryResponseDto } from '../../types/api.types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Plus, Search, Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react';

export default function BlogCategoryPage() {
  const [categories, setCategories] = useState<BlogCategoryResponseDto[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<BlogCategoryResponseDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategoryResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    strCategoryName: '',
    strCategorySlug: '',
    strDescription: '',
    bolIsActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.strCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.strCategorySlug.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await blogCategoryService.getAllCategories(true);
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setFormData({ strCategoryName: '', strCategorySlug: '', strDescription: '', bolIsActive: true });
    setIsFormOpen(true);
  };

  const handleEdit = (category: BlogCategoryResponseDto) => {
    setSelectedCategory(category);
    setFormData({
      strCategoryName: category.strCategoryName,
      strCategorySlug: category.strCategorySlug,
      strDescription: category.strDescription || '',
      bolIsActive: category.bolIsActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await blogCategoryService.deleteCategory(id);
      loadCategories();
    } catch (error: any) {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        await blogCategoryService.updateCategory(selectedCategory.strCategoryGUID, formData);
      } else {
        await blogCategoryService.createCategory(formData);
      }
      setIsFormOpen(false);
      loadCategories();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-gray-500 mt-1">Organize blog posts by categories</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            All Categories
          </CardTitle>
          <CardDescription>Total: {categories.length} categories</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.strCategoryGUID}>
                    <TableCell className="font-medium">{category.strCategoryName}</TableCell>
                    <TableCell><code className="text-sm">{category.strCategorySlug}</code></TableCell>
                    <TableCell className="max-w-xs truncate">{category.strDescription || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={category.bolIsActive ? 'default' : 'secondary'}>
                        {category.bolIsActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.strCategoryGUID)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>Manage blog category information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strCategoryName">Category Name *</Label>
              <Input
                id="strCategoryName"
                value={formData.strCategoryName}
                onChange={(e) => setFormData({ ...formData, strCategoryName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strCategorySlug">Slug *</Label>
              <Input
                id="strCategorySlug"
                value={formData.strCategorySlug}
                onChange={(e) => setFormData({ ...formData, strCategorySlug: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strDescription">Description</Label>
              <Textarea
                id="strDescription"
                value={formData.strDescription}
                onChange={(e) => setFormData({ ...formData, strDescription: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.bolIsActive}
                onCheckedChange={(checked) => setFormData({ ...formData, bolIsActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {selectedCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
