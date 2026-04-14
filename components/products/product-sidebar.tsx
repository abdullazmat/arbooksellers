"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, SlidersHorizontal, Star, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export interface FilterState {
  search: string;
  minPrice: number;
  maxPrice: number;
  featured: boolean;
  category: string | string[];
}

interface ProductSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories?: Category[];
}

export function ProductSidebar({ filters, onChange, className = "" }: ProductSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);
  const [minInput, setMinInput] = useState(filters.minPrice.toString());
  const [maxInput, setMaxInput] = useState(filters.maxPrice.toString());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          const hiddenCategories = ["sawab", "digital quran"];
          const filteredCategories = data.categories.filter(
            (c: Category) => !hiddenCategories.includes(c.name.toLowerCase())
          );
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Update local price range when filters prop changes (e.g. from clear filters)
  useEffect(() => {
    setPriceRange([filters.minPrice, filters.maxPrice]);
    setMinInput(filters.minPrice.toString());
    setMaxInput(filters.maxPrice.toString());
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceChangeEnded = (value: number[]) => {
    onChange({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const handleCategoryChange = (categoryId: string) => {
    let newCategories: string[] = [];
    if (Array.isArray(filters.category)) {
      if (filters.category.includes(categoryId)) {
        newCategories = filters.category.filter(id => id !== categoryId);
      } else {
        newCategories = [...filters.category, categoryId];
      }
    } else {
      if (filters.category === "all" || !filters.category) {
        newCategories = [categoryId];
      } else {
        if (filters.category === categoryId) {
            newCategories = [];
        } else {
            newCategories = [filters.category, categoryId];
        }
      }
    }
    
    onChange({
      ...filters,
      category: newCategories.length === 0 ? "all" : newCategories,
    });
  };

  const clearFilters = () => {
    onChange({
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      featured: false,
      category: "all",
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-islamic-green-600" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-xs font-semibold text-muted-foreground hover:text-islamic-green-600 uppercase tracking-widest"
        >
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full space-y-4">
        {/* Categories */}
        <AccordionItem value="category" className="border-0 bg-accent/20 dark:bg-accent/10 rounded-2xl px-5">
          <AccordionTrigger className="hover:no-underline font-semibold text-foreground py-5">
            Categories
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="cat-all"
                  checked={filters.category === "all" || (Array.isArray(filters.category) && filters.category.length === 0)}
                  onCheckedChange={() => onChange({ ...filters, category: "all" })}
                  className="rounded-[4px] border-border text-islamic-green-600 focus:ring-islamic-green-600"
                />
                <Label htmlFor="cat-all" className="cursor-pointer font-medium text-sm text-foreground/80">
                  All Categories
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category._id} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`cat-${category.slug}`}
                      checked={Array.isArray(filters.category) ? filters.category.includes(category.slug) : filters.category === category.slug}
                      onCheckedChange={() => handleCategoryChange(category.slug)}
                      className="rounded-[4px] border-border text-islamic-green-600 focus:ring-islamic-green-600"
                    />
                    <Label
                      htmlFor={`cat-${category.slug}`}
                      className="cursor-pointer font-medium text-sm text-foreground/80"
                    >
                      {category.name}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-0 bg-accent/20 dark:bg-accent/10 rounded-2xl px-5">
          <AccordionTrigger className="hover:no-underline font-semibold text-foreground py-5">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pb-5 px-1">
            <div className="space-y-6 pt-2">
              <Slider
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={(val) => {
                  setPriceRange(val);
                  setMinInput(val[0].toString());
                  setMaxInput(val[1].toString());
                }}
                onValueCommit={handlePriceChangeEnded}
                className="py-4"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1 block uppercase tracking-widest font-bold">Min</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rs</span>
                    <Input
                      type="number"
                      value={minInput}
                      onChange={(e) => setMinInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt(minInput) || 0;
                          setPriceRange([val, priceRange[1]]);
                          handlePriceChangeEnded([val, priceRange[1]]);
                        }
                      }}
                      onBlur={() => {
                        const val = parseInt(minInput) || 0;
                        setPriceRange([val, priceRange[1]]);
                        handlePriceChangeEnded([val, priceRange[1]]);
                      }}
                      className="pl-8 bg-background border-border rounded-xl shadow-sm h-11 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <div className="text-gray-300 mt-5">-</div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1 block uppercase tracking-widest font-bold">Max</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rs</span>
                    <Input
                      type="number"
                      value={maxInput}
                      onChange={(e) => setMaxInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseInt(maxInput) || 10000;
                          setPriceRange([priceRange[0], val]);
                          handlePriceChangeEnded([priceRange[0], val]);
                        }
                      }}
                      onBlur={() => {
                        const val = parseInt(maxInput) || 10000;
                        setPriceRange([priceRange[0], val]);
                        handlePriceChangeEnded([priceRange[0], val]);
                      }}
                      className="pl-8 bg-background border-border rounded-xl shadow-sm h-11 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>


      </Accordion>
    </div>
  );

  return (
    <>
      <div className={`hidden lg:block w-72 flex-shrink-0 ${className}`}>
        <div className="sticky top-24 bg-card rounded-[2.5rem] border border-border/50 p-6 shadow-sm">
          {FilterContent()}
        </div>
      </div>

      <div className="lg:hidden mb-6 flex gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex-1 h-12 rounded-xl border-border gap-2 font-semibold">
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Filters
              {(filters.category !== "all" || filters.minPrice > 0 || filters.maxPrice < 10000 || filters.featured) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-islamic-green-600 text-[10px] font-bold text-white ml-2">
                  {[
                    filters.category !== "all" ? 1 : 0,
                    filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0,
                    filters.featured ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6 overflow-y-auto">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="font-bold text-2xl">Refine Search</SheetTitle>
            </SheetHeader>
            {FilterContent()}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
