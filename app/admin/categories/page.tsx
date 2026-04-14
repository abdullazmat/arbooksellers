"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Folder,
  FolderOpen,
  Loader2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, clearExpiredAdminTokens } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string;
  subcategories?: Category[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

interface CategoryFormData {
  name: string;
  parent: string;
  isActive: boolean;
  sortOrder: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    parent: "none",
    isActive: true,
    sortOrder: "0",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check token expiration on mount
    if (clearExpiredAdminTokens()) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please login again.",
        variant: "destructive",
      });
      window.location.href = "/admin/login";
      return;
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Admin token not found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          });
          window.location.href = "/admin/login";
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.categories);
      console.log('Categories loaded:', data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      parent: "none",
      isActive: true,
      sortOrder: "0",
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      parent: category.parent || "none",
      isActive: category.isActive,
      sortOrder: category.sortOrder.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsViewDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const token = localStorage.getItem("adminToken");

      const categoryData = {
        ...formData,
        sortOrder: parseInt(formData.sortOrder),
        parent: formData.parent === "none" ? undefined : formData.parent || undefined,
      };

      const url = selectedCategory
        ? `/api/admin/categories/${selectedCategory._id}`
        : "/api/admin/categories";

      const method = selectedCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: selectedCategory
          ? "Category updated successfully"
          : "Category created successfully",
      });

      if (selectedCategory) {
        setIsEditDialogOpen(false);
      } else {
        setIsAddDialogOpen(false);
      }

      setSelectedCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter categories based on search term (including subcategories)
  const filteredCategories = categories.filter((category) => {
    const matchesName = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubcategory = category.subcategories?.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesName || matchesSubcategory;
  });

  // Use the organized categories structure from API
  const parentCategories = filteredCategories;

  if (loading && categories.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 selection:bg-islamic-green-100 selection:text-islamic-green-900">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Taxonomy Control</h1>
            <p className="text-muted-foreground font-medium mt-1">Organize and structure your product hierarchy</p>
          </div>
          <Button
            className="h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-foreground text-background hover:bg-islamic-green-600 hover:text-white transition-all shadow-xl shadow-islamic-green-600/10"
            onClick={openAddDialog}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Classification
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border/50 dark:border-white/5 shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-white/2 pb-6 px-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-foreground">Hierarchy Search</CardTitle>
                <CardDescription className="font-medium">Filter the taxonomy registry</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-islamic-green-600 transition-colors" />
                  <Input
                    placeholder="Search by classification name or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 rounded-2xl bg-zinc-100/50 dark:bg-background border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-islamic-green-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card className="bg-card border-border/50 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-zinc-50/50 dark:bg-white/2 p-8 text-center sm:text-left">
            <CardTitle className="text-2xl font-black text-foreground tracking-tight">Active Classifications</CardTitle>
            <CardDescription className="font-medium mt-1">{parentCategories.length} root levels identified</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="space-y-4">
              {parentCategories.map((category) => (
                <div key={category._id} className="border border-border/50 dark:border-white/5 rounded-[2rem] overflow-hidden bg-zinc-50/30 dark:bg-white/1 transition-all hover:bg-zinc-50/50 dark:hover:bg-white/2">
                  {/* Parent Category */}
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(category._id)}
                        className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-200 dark:hover:bg-white/10"
                      >
                        {expandedCategories.has(category._id) ? (
                          <ChevronDown className="h-5 w-5 text-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                      <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-sm">
                        <Folder className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-black text-foreground text-lg tracking-tight">
                          {category.name}
                        </div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Slug: {category.slug}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${category.isActive ? "bg-islamic-green-500/10 text-islamic-green-600" : "bg-zinc-200 dark:bg-white/5 text-muted-foreground"} border-none text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg shadow-sm`}>
                        {category.isActive ? "Online" : "Terminated"}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-xl hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
                          onClick={() => openViewDialog(category)}
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-800 dark:hover:bg-white hover:text-background transition-all"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id)}
                          className="h-10 w-10 p-0 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.has(category._id) && category.subcategories && (
                    <div className="border-t border-border/30 bg-white/5 dark:bg-black/5 divide-y divide-border/20 px-4 py-2">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory._id} className="flex items-center justify-between p-5 pl-14 hover:bg-zinc-100/50 dark:hover:bg-white/2 rounded-2xl transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="h-1 w-4 bg-border/50 rounded-full" />
                            <div className="p-2 bg-islamic-green-500/10 rounded-lg group-hover:scale-110 transition-transform">
                              <FolderOpen className="h-4 w-4 text-islamic-green-600" />
                            </div>
                            <div>
                                <div className="font-bold text-foreground text-sm">
                                  {subcategory.name}
                                </div>
                                <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">SUB-REF: {subcategory._id.slice(-6)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={`${subcategory.isActive ? "bg-islamic-green-500/10 text-islamic-green-600" : "bg-zinc-200 dark:bg-white/5 text-muted-foreground"} border-none text-[8px] font-black uppercase tracking-widest h-5 px-2 rounded-md`}>
                              {subcategory.isActive ? "Active" : "Locked"}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg hover:bg-blue-500/10 hover:text-blue-600"
                                onClick={() => openViewDialog(subcategory)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg hover:bg-zinc-800 dark:hover:bg-white hover:text-background"
                                onClick={() => openEditDialog(subcategory)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(subcategory._id)}
                                className="h-9 w-9 p-0 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {category.subcategories.length === 0 && (
                        <div className="p-10 text-center">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">Empty Subset Registry</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Category Dialog */}
        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => { if(!open) { setIsAddDialogOpen(false); setIsEditDialogOpen(false); setSelectedCategory(null); resetForm(); } }}>
          <DialogContent className="bg-background border border-border/50 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] rounded-[3rem] max-w-2xl w-full p-10">
            <DialogHeader className="mb-8 text-left">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-islamic-green-500/10 flex items-center justify-center border border-islamic-green-500/20">
                  <Plus className="h-7 w-7 text-islamic-green-600" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black text-foreground tracking-tighter">
                   {isEditDialogOpen ? 'Update Classification' : 'New Classification'}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Configure taxonomy parameters</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Classification Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Traditional Sciences"
                    required
                    className="h-14 rounded-2xl bg-zinc-100/50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-islamic-green-500 transition-all px-5 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Level Authority</Label>
                  <Select
                    value={formData.parent}
                    onValueChange={(value) =>
                      setFormData({ ...formData, parent: value })
                    }
                  >
                    <SelectTrigger className="h-14 rounded-2xl bg-zinc-100/50 dark:bg-white/5 border-transparent px-5 font-bold focus:ring-islamic-green-600">
                      <SelectValue placeholder="Select parent classification" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/50 rounded-2xl shadow-2xl">
                      <SelectItem value="none" className="font-bold py-3">Root Authority (Main)</SelectItem>
                      {categories
                        .filter(cat => !cat.parent && cat._id !== selectedCategory?._id)
                        .map((category) => (
                          <SelectItem key={category._id} value={category._id} className="font-bold py-3">
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority Index</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: e.target.value })
                    }
                    className="h-14 rounded-2xl bg-zinc-100/50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-islamic-green-500 transition-all px-5 font-bold"
                  />
                </div>
                <div className="flex items-center justify-between p-5 bg-zinc-100/50 dark:bg-white/5 rounded-2xl border border-transparent mt-auto">
                    <Label htmlFor="isActive" className="text-sm font-black text-foreground">Operational Status</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                      className="data-[state=checked]:bg-islamic-green-600"
                    />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/50"
                  onClick={() => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); setSelectedCategory(null); resetForm(); }}
                >
                  Discard
                </Button>
                <Button type="submit" disabled={submitting} className="h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-foreground text-background hover:bg-islamic-green-600 hover:text-white transition-all shadow-xl">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    isEditDialogOpen ? "Update Record" : "Execute Entry"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Category Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-background border border-border/50 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] rounded-[3rem] max-w-2xl w-full p-10">
            <DialogHeader className="mb-10 text-left">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                     <Eye className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-black text-foreground tracking-tighter">Classification Insight</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Deep analysis of taxonomy node</DialogDescription>
                  </div>
               </div>
            </DialogHeader>
            {selectedCategory && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Classification Ident", value: selectedCategory.name },
                    { label: "URL Identifier (Slug)", value: selectedCategory.slug },
                    { label: "Sequence Index", value: selectedCategory.sortOrder },
                    { label: "Lifecycle Status", value: selectedCategory.isActive ? "Active" : "Inactive", isBadge: true },
                    { label: "First Entry", value: new Date(selectedCategory.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5 p-6 bg-zinc-50/50 dark:bg-white/2 border border-border/30 rounded-2xl">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                      {item.isBadge ? (
                        <Badge className={`${selectedCategory.isActive ? "bg-islamic-green-500/10 text-islamic-green-600" : "bg-red-500/10 text-red-600"} border-none text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg mt-1`}>{item.value}</Badge>
                      ) : (
                        <p className="text-base font-black text-foreground tracking-tight">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                  <div className="pt-4 px-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Direct Genetic Subsets</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.subcategories.map((sub) => (
                        <div key={sub._id} className="flex items-center gap-2 bg-zinc-100/50 dark:bg-white/5 py-2.5 px-4 rounded-xl border border-border/30 shadow-sm">
                          <FolderOpen className="h-4 w-4 text-islamic-green-600" />
                          <span className="text-sm font-black text-foreground">{sub.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-6">
                  <Button
                    variant="outline"
                    className="h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/50 hover:bg-foreground hover:text-background transition-all"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close Analysis
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
