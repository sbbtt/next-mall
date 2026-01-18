"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Sparkles, Plus } from "lucide-react"

const categories = ["Furniture", "Decor", "Textiles", "Lighting", "Storage"]
const colorOptions = ["White", "Black", "Gray", "Beige", "Brown", "Blue", "Green"]
const sizeOptions = ["XS", "S", "M", "L", "XL"]

export default function NewProductPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      )
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const handleAIGenerate = async () => {
    if (!productName.trim()) {
      alert('상품명을 먼저 입력해주세요!')
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          category,
          price,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate description')
      }

      const data = await response.json()
      setDescription(data.description)
    } catch (error) {
      console.error('AI generation error:', error)
      alert('설명 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreateProduct = async () => {
    if (!productName.trim() || !price || !category) {
      alert('상품명, 가격, 카테고리는 필수 입력 항목입니다!')
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productName,
          description,
          price,
          category,
          image: images[0] || null, // 첫 번째 이미지 사용 (없으면 Unsplash에서 자동)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        throw new Error(errorData.error || 'Failed to create product')
      }

      const data = await response.json()
      
      alert('상품이 성공적으로 등록되었습니다!')
      router.push('/admin/products')
      
    } catch (error) {
      console.error('Product creation error:', error)
      alert('상품 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "New Product" },
        ]}
      />
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold">Add New Product</h1>
          <p className="text-muted-foreground">
            Fill in the details to add a new product to your store
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter product name" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₩
                      </span>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        className="pl-7"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Media</CardTitle>
                <CardDescription>
                  Add photos of your product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative h-24 w-24 overflow-hidden rounded-lg border border-border"
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute right-1 top-1 rounded-full bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label
                    htmlFor="images"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-8 transition-colors hover:border-muted-foreground/50 hover:bg-muted"
                  >
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Drag and drop or click to upload
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </span>
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Description</CardTitle>
                    <CardDescription>
                      Describe your product in detail
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="relative overflow-hidden border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-800 dark:border-indigo-800 dark:from-indigo-950/50 dark:to-purple-950/50 dark:text-indigo-300 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating..." : "AI Auto-Generate"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter product description..."
                  className="min-h-32 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Options</CardTitle>
                <CardDescription>
                  Add variants like colors and sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Colors</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <Badge
                        key={color}
                        variant={
                          selectedColors.includes(color) ? "default" : "outline"
                        }
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleColor(color)}
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <Badge
                        key={size}
                        variant={
                          selectedSizes.includes(size) ? "default" : "outline"
                        }
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full"
                    onClick={handleCreateProduct}
                    disabled={isCreating}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {isCreating ? '등록 중...' : 'Create Product'}
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Enter SKU" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
