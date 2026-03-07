import { useState, useEffect } from 'react';
import { menuService } from '../../services/menu.service';
import type { MenuResponseDto } from '../../types/api.types';
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
import { Plus, Search, Pencil, Trash2, Menu, Loader2 } from 'lucide-react';

export default function MenuManagementPage() {
  const [menus, setMenus] = useState<MenuResponseDto[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<MenuResponseDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    strMenuName: '',
    strMenuKey: '',
    strPath: '',
    strIcon: '',
    dblSeqNo: 0,
    bolIsActive: true,
  });

  useEffect(() => {
    loadMenus();
  }, []);

  useEffect(() => {
    const filtered = menus.filter((menu) =>
      menu.strMenuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.strMenuKey.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMenus(filtered);
  }, [searchQuery, menus]);

  const loadMenus = async () => {
    setIsLoading(true);
    try {
      const response = await menuService.getAllMenus();
      setMenus(response.data);
      setFilteredMenus(response.data);
    } catch (error) {
      console.error('Failed to load menus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedMenu(null);
    setFormData({ strMenuName: '', strMenuKey: '', strPath: '', strIcon: '', dblSeqNo: 0, bolIsActive: true });
    setIsFormOpen(true);
  };

  const handleEdit = (menu: MenuResponseDto) => {
    setSelectedMenu(menu);
    setFormData({
      strMenuName: menu.strMenuName,
      strMenuKey: menu.strMenuKey,
      strPath: menu.strPath || '',
      strIcon: menu.strIcon || '',
      dblSeqNo: menu.dblSeqNo,
      bolIsActive: menu.bolIsActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await menuService.deleteMenu(id);
      loadMenus();
    } catch (error: any) {
      alert('Failed: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedMenu) {
        await menuService.updateMenu(selectedMenu.strMenuGUID, formData);
      } else {
        await menuService.createMenu(formData);
      }
      setIsFormOpen(false);
      loadMenus();
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
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Configure application navigation menus</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Menu
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            All Menus
          </CardTitle>
          <CardDescription>Total: {menus.length} menu items</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menus..."
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
                  <TableHead>Menu Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Sequence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMenus.map((menu) => (
                  <TableRow key={menu.strMenuGUID}>
                    <TableCell className="font-medium">{menu.strMenuName}</TableCell>
                    <TableCell><code className="text-sm">{menu.strMenuKey}</code></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{menu.strPath || '-'}</TableCell>
                    <TableCell>{menu.dblSeqNo}</TableCell>
                    <TableCell>
                      <Badge variant={menu.bolIsActive ? 'default' : 'secondary'}>
                        {menu.bolIsActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(menu)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(menu.strMenuGUID)}
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
            <DialogTitle>{selectedMenu ? 'Edit Menu' : 'Add Menu'}</DialogTitle>
            <DialogDescription>Configure menu item details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strMenuName">Menu Name *</Label>
              <Input
                id="strMenuName"
                value={formData.strMenuName}
                onChange={(e) => setFormData({ ...formData, strMenuName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strMenuKey">Key *</Label>
              <Input
                id="strMenuKey"
                value={formData.strMenuKey}
                onChange={(e) => setFormData({ ...formData, strMenuKey: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strPath">Path</Label>
              <Input
                id="strPath"
                value={formData.strPath}
                onChange={(e) => setFormData({ ...formData, strPath: e.target.value })}
                placeholder="/path/to/page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strIcon">Icon</Label>
              <Input
                id="strIcon"
                value={formData.strIcon}
                onChange={(e) => setFormData({ ...formData, strIcon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dblSeqNo">Sequence Number</Label>
              <Input
                id="dblSeqNo"
                type="number"
                value={formData.dblSeqNo}
                onChange={(e) => setFormData({ ...formData, dblSeqNo: Number(e.target.value) })}
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
                {selectedMenu ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
