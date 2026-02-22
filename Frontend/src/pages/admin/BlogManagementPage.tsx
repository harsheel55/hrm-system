import { useState, useEffect } from 'react';
import { blogService } from '../../services/blog.service';
import type { BlogResponseDto } from '../../types/api.types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Plus, Search, Pencil, Trash2, FileText, Loader2, Eye } from 'lucide-react';

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogResponseDto[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogResponseDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.strBlogTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.strBlogSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.strCategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await blogService.getAllBlogs(true);
      setBlogs(response.data);
      setFilteredBlogs(response.data);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await blogService.deleteBlog(id);
      loadBlogs();
    } catch (error: any) {
      alert('Failed to delete: ' + error.message);
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
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 mt-1">Create and manage blog posts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Blog Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Blog Posts
          </CardTitle>
          <CardDescription>Total: {blogs.length} posts</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, slug, or category..."
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No blog posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map((blog) => (
                    <TableRow key={blog.strBlogGUID}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {blog.strFeaturedImageUrl && (
                            <img
                              src={blog.strFeaturedImageUrl}
                              alt={blog.strBlogTitle}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <div>{blog.strBlogTitle}</div>
                            {blog.bolIsFeatured && (
                              <Badge variant="outline" className="text-xs mt-1 bg-yellow-50 text-yellow-700">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {blog.strCategoryName ? (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {blog.strCategoryName}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          {blog.intViewCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={blog.bolIsActive ? 'default' : 'secondary'}
                          className={
                            blog.bolIsActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {blog.bolIsActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={blog.bolIsPublished ? 'default' : 'secondary'}
                          className={
                            blog.bolIsPublished
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {blog.bolIsPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(blog.dtCreatedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(blog.strBlogGUID, blog.strBlogTitle)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
