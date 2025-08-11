'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Filter, X } from 'lucide-react'

interface ProductFiltersProps {
  filters: {
    category: string
    priceRange: [number, number]
    language: string
    author: string
    inStock: boolean
  }
  onChange: (filters: any) => void
}

const categories = [
  { value: 'quran', label: 'Quran & Tafsir', count: 45 },
  { value: 'hadith', label: 'Hadith Collections', count: 32 },
  { value: 'fiqh', label: 'Islamic Jurisprudence', count: 28 },
  { value: 'aqeedah', label: 'Islamic Creed', count: 18 },
  { value: 'seerah', label: 'Prophet Biography', count: 25 },
  { value: 'children', label: 'Children Books', count: 22 },
  { value: 'general', label: 'General Islamic', count: 35 },
]

const languages = [
  { value: 'arabic', label: 'Arabic', count: 28 },
  { value: 'english', label: 'English', count: 45 },
  { value: 'urdu', label: 'Urdu', count: 15 },
  { value: 'multilingual', label: 'Multilingual', count: 12 },
]

const authors = [
  'Dr. Muhammad Taqi-ud-Din',
  'Imam Al-Bukhari',
  'Safiur Rahman Mubarakpuri',
  'Dr. Muhammad Hamidullah',
  'Various Authors',
]

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onChange(newFilters)
  }

  const handlePriceRangeChange = (value: number[]) => {
    handleFilterChange('priceRange', [value[0], value[1]])
  }

  const handleCategoryChange = (category: string) => {
    handleFilterChange('category', category === filters.category ? '' : category)
  }

  const handleLanguageChange = (language: string) => {
    handleFilterChange('language', language === filters.language ? '' : language)
  }

  const handleAuthorChange = (author: string) => {
    handleFilterChange('author', author === filters.author ? '' : author)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: [0, 200],
      language: '',
      author: '',
      inStock: false,
    }
    setLocalFilters(clearedFilters)
    onChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false && 
    !(Array.isArray(value) && value[0] === 0 && value[1] === 200)
  )

  return (
    <Card className="sticky top-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <CardDescription>
          Refine your search results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-medium text-sm mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={filters.category === category.value}
                  onCheckedChange={() => handleCategoryChange(category.value)}
                />
                <label
                  htmlFor={category.value}
                  className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                >
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="font-medium text-sm mb-3">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>PKR {filters.priceRange[0]}</span>
              <span>PKR {filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Languages */}
        <div>
          <h3 className="font-medium text-sm mb-3">Languages</h3>
          <div className="space-y-2">
            {languages.map((language) => (
              <div key={language.value} className="flex items-center space-x-2">
                <Checkbox
                  id={language.value}
                  checked={filters.language === language.value}
                  onCheckedChange={() => handleLanguageChange(language.value)}
                />
                <label
                  htmlFor={language.value}
                  className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                >
                  <span>{language.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {language.count}
                  </Badge>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Authors */}
        <div>
          <h3 className="font-medium text-sm mb-3">Popular Authors</h3>
          <div className="space-y-2">
            {authors.map((author) => (
              <div key={author} className="flex items-center space-x-2">
                <Checkbox
                  id={author}
                  checked={filters.author === author}
                  onCheckedChange={() => handleAuthorChange(author)}
                />
                <label
                  htmlFor={author}
                  className="text-sm cursor-pointer flex-1"
                >
                  {author}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div>
          <h3 className="font-medium text-sm mb-3">Availability</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
            />
            <label
              htmlFor="inStock"
              className="text-sm cursor-pointer"
            >
              In Stock Only
            </label>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div>
              <h3 className="font-medium text-sm mb-3">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <Badge variant="outline" className="text-xs">
                    Category: {categories.find(c => c.value === filters.category)?.label}
                  </Badge>
                )}
                {filters.language && (
                  <Badge variant="outline" className="text-xs">
                    Language: {languages.find(l => l.value === filters.language)?.label}
                  </Badge>
                )}
                {filters.author && (
                  <Badge variant="outline" className="text-xs">
                    Author: {filters.author}
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge variant="outline" className="text-xs">
                    In Stock Only
                  </Badge>
                )}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 200) && (
                  <Badge variant="outline" className="text-xs">
                    Price: PKR {filters.priceRange[0]} - {filters.priceRange[1]}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
