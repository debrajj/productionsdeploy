import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Plus, Trash2, Edit } from 'lucide-react';

export const AddressManager: React.FC = () => {
  const { addresses, addAddress, deleteAddress, updateAddress } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success;
    if (editingId) {
      success = await updateAddress(editingId, {
        type: 'home',
        ...formData,
        isDefault: addresses.find(a => a.id === editingId)?.isDefault || false
      });
      toast({ title: "Address Updated", description: "Your address has been updated successfully." });
    } else {
      success = await addAddress({
        type: 'home',
        ...formData,
        isDefault: addresses.length === 0
      });
      toast({ title: "Address Added", description: "Your address has been saved successfully." });
    }

    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    });
  };

  const handleEdit = (address: any) => {
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAddress(id);
    if (success) {
      toast({ title: "Address Deleted", description: "Address removed successfully." });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Saved Addresses
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length === 0 && !showForm && (
          <p className="text-gray-500 text-center py-4">
            No addresses saved. Add an address for faster checkout.
          </p>
        )}

        {addresses.map((address) => (
          <div key={address.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{address.firstName} {address.lastName}</p>
                <p className="text-sm text-gray-600">{address.address}</p>
                {address.apartment && <p className="text-sm text-gray-600">{address.apartment}</p>}
                <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.zipCode}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
                {address.isDefault && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">
                    Default
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(address)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="apartment">Apartment (Optional)</Label>
              <Input
                id="apartment"
                value={formData.apartment}
                onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">PIN Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit">{editingId ? 'Update Address' : 'Save Address'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};