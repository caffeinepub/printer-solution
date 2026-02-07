import { useState } from 'react';
import { useAssignUserRole } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, UserPlus } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../backend';

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserManagementDialog({ open, onOpenChange }: UserManagementDialogProps) {
  const [principalId, setPrincipalId] = useState('');
  const [error, setError] = useState('');
  const assignRole = useAssignUserRole();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!principalId.trim()) {
      setError('Please enter a principal ID');
      return;
    }

    try {
      const principal = Principal.fromText(principalId.trim());
      await assignRole.mutateAsync({ principal, role: UserRole.user });
      setPrincipalId('');
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid principal ID or failed to add user');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
          <DialogDescription>
            Add users by entering their Internet Identity Principal ID
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principalId">Principal ID</Label>
            <Input
              id="principalId"
              placeholder="Enter principal ID"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              disabled={assignRole.isPending}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {assignRole.isSuccess && (
            <Alert>
              <AlertDescription>User added successfully!</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={assignRole.isPending}>
            <UserPlus className="mr-2 h-4 w-4" />
            {assignRole.isPending ? 'Adding User...' : 'Add User'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
