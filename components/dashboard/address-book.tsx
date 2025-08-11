'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Building, 
  Loader2,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

interface Address {
  _id: string
  type: 'home' | 'work' | 'other'
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
  })
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/user/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch addresses')
      }

      const data = await response.json()
      setAddresses(data.addresses)
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast({
        title: 'Error',
        description: 'Failed to load addresses',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const url = editingAddress 
        ? `/api/user/addresses` 
        : '/api/user/addresses'
      
      const method = editingAddress ? 'PUT' : 'POST'
      const body = editingAddress 
        ? { addressId: editingAddress._id, addressData: formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to save address')
      }

      const data = await response.json()
      setAddresses(data.addresses)
      
      toast({
        title: 'Success',
        description: editingAddress 
          ? 'Address updated successfully' 
          : 'Address added successfully',
      })

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving address:', error)
      toast({
        title: 'Error',
        description: 'Failed to save address',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/user/addresses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ addressId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete address')
      }

      const data = await response.json()
      setAddresses(data.addresses)
      
      toast({
        title: 'Success',
        description: 'Address deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting address:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete address',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan',
    })
    setEditingAddress(null)
  }

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />
      case 'work':
        return <Building className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home':
        return 'bg-green-100 text-green-800'
      case 'work':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress ? 'Update your address information' : 'Add a new shipping address'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Address Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'work' | 'other' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Address Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., My Home, Office"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Karachi"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Sindh"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="75000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
              <p className="text-gray-600 mb-4">
                Add your first shipping address to get started
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          addresses.map((address) => (
            <Card key={address._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getAddressIcon(address.type)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{address.name}</h3>
                      <Badge className={getAddressTypeColor(address.type)}>
                        {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p>{address.country}</p>
                </div>

                {address.isDefault && (
                  <div className="flex items-center space-x-1 mt-3 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Default Address</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
