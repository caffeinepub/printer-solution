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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserManagementDialog({ open, onOpenChange }: UserManagementDialogProps) {
  const [principalId, setPrincipalId] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.user);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const assignRole = useAssignUserRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!principalId.trim()) {
      setError('Please enter a Principal ID');
      return;
    }

    try {
      const principal = Principal.fromText(principalId.trim());
      await assignRole.mutateAsync({ principal, role });
      setSuccess(`Successfully assigned ${role} role`);
      setPrincipalId('');
      setRole(UserRole.user);
    } catch (err: any) {
      setError(err.message || 'Failed to assign role. Please check the Principal ID and try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-surface sm:max-w-md">
        <DialogHeader className="dialog-header">
          <DialogTitle>User Management</DialogTitle>
          <DialogDescription>
            Add users by their Internet Identity Principal ID
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="principal">Principal ID *</Label>
            <Input
              id="principal"
              placeholder="Enter Principal ID"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              disabled={assignRole.isPending}
              className="input-focus font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              The user's Internet Identity Principal ID
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={assignRole.isPending}>
              <SelectTrigger id="role" className="input-focus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.admin}>Admin</SelectItem>
                <SelectItem value={UserRole.user}>User</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Admins can manage users and approve quotations
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-success/50 bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success-foreground">{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={assignRole.isPending}
              className="flex-1 btn-interactive"
            >
              Close
            </Button>
            <Button type="submit" disabled={assignRole.isPending} className="flex-1 btn-interactive">
              {assignRole.isPending ? 'Adding...' : 'Add User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
