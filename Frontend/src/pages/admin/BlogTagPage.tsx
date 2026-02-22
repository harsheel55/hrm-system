import { useState, useEffect } from 'react';
import { blogTagService } from '../../services/blog.service';
import type { BlogTagResponseDto } from '../../types/api.types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
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
import { Plus, Search, Pencil, Trash2, Tags, Loader2 } from 'lucide-react';

export default function BlogTagPage() {
  const [tags, setTags] = useState<BlogTagResponseDto[]>([]);
  const [filteredTags, setFilteredTags] = useState<BlogTagResponseDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<BlogTagResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    strTagName: '',
    strTagSlug: '',
    bolIsActive: true,
  });

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    const filtered = tags.filter((tag) =>
      tag.strTagName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.strTagSlug.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTags(filtered);
  }, [searchQuery, tags]);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const response = await blogTagService.getAllTags(true);
      setTags(response.data);
      setFilteredTags(response.data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedTag(null);
    setFormData({ strTagName: '', strTagSlug: '', bolIsActive: true });
    setIsFormOpen(true);
  };

  const handleEdit = (tag: BlogTagResponseDto) => {
    setSelectedTag(tag);
    setFormData({
      strTagName: tag.strTagName,
      strTagSlug: tag.strTagSlug,
      bolIsActive: tag.bolIsActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await blogTagService.deleteTag(id);
      loadTags();
    } catch (error: any) {
      alert('Failed: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedTag) {
        await blogTagService.updateTag(selectedTag.strTagGUID, formData);
      } else {
        await blogTagService.createTag(formData);
      }
      setIsFormOpen(false);
      loadTags();
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
          <h1 className="text-3xl font-bold text-gray-900">Blog Tags</h1>
          <p className="text-gray-500 mt-1">Manage blog post tags</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            All Tags
          </CardTitle>
          <CardDescription>Total: {tags.length} tags</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tags..."
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
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.strTagGUID}>
                    <TableCell className="font-medium">{tag.strTagName}</TableCell>
                    <TableCell><code className="text-sm">{tag.strTagSlug}</code></TableCell>
                    <TableCell>
                      <Badge variant={tag.bolIsActive ? 'default' : 'secondary'}>
                        {tag.bolIsActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(tag)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tag.strTagGUID)}
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
            <DialogTitle>{selectedTag ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
            <DialogDescription>Manage blog tag information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strTagName">Tag Name *</Label>
              <Input
                id="strTagName"
                value={formData.strTagName}
                onChange={(e) => setFormData({ ...formData, strTagName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strTagSlug">Slug *</Label>
              <Input
                id="strTagSlug"
                value={formData.strTagSlug}
                onChange={(e) => setFormData({ ...formData, strTagSlug: e.target.value })}
                required
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
                {selectedTag ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
