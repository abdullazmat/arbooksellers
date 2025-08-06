'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface ProductFiltersProps {
  filters: {
    category: string
    priceRange: number[]
    language: string
    author: string
    inStock: boolean
  }
  onChange: (filters: any) => void
}

const categories = [
  { id: '', label: 'All Categories' },
  { id: 'quran', label: 'Holy Quran' },
  { id: 'hadith', label: 'Hadith Collections' },
  { id: 'islamic-studies', label: 'Islamic Studies' },
  { id: 'kids', label: 'Children\'s Books' }
]

const languages = [
  { id: '', label: 'All Languages' },
  { id: 'arabic', label: 'Arabic' },
  { id: 'english', label: 'English' },
  { id: 'arabic/english', label: 'Arabic/English' }
]

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onChange({
      category: '',
      priceRange: [0, 200],
      language: '',
      author: '',
      inStock: false
    })
  }

  const hasActiveFilters = filters.category || filters.language || filters.author || filters.inStock || 
    filters.priceRange[0] > 0 || filters.priceRange[1] < 200

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.id === filters.category)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('category', '')}
                  />
                </Badge>
              )}
              {filters.language && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {languages.find(l => l.id === filters.language)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('language', '')}
                  />
                </Badge>
              )}
              {filters.author && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Author: {filters.author}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('author', '')}
                  />
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  In Stock Only
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('inStock', false)}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.category === category.id}
                  onCheckedChange={() => updateFilter('category', category.id)}
                />
                <Label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="px-3">
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Language</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {languages.map((language) => (
              <div key={language.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`language-${language.id}`}
                  checked={filters.language === language.id}
                  onCheckedChange={() => updateFilter('language', language.id)}
                />
                <Label 
                  htmlFor={`language-${language.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {language.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Author Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Author</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by author..."
            value={filters.author}
            onChange={(e) => updateFilter('author', e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Availability Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilter('inStock', checked)}
            />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
