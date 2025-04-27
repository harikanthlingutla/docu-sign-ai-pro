
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export function ProfileTab() {
  const [name, setName] = React.useState('John Doe');
  const [organization, setOrganization] = React.useState('Example Corp');

  const handleSave = () => {
    // In a real app, this would call the profile update API
    toast.success('Profile updated successfully');
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-sm text-tertiary">Manage your account settings</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-tertiary">
                Full Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="organization" className="text-sm text-tertiary">
                Organization
              </label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter your organization"
              />
            </div>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your current plan and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm text-tertiary">Email</span>
              <p className="font-medium">john@example.com</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-tertiary">Current Plan</span>
              <p className="font-medium">Pro Plan</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-tertiary">Document Usage</span>
              <p className="font-medium">5 / 100 Documents Used</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
