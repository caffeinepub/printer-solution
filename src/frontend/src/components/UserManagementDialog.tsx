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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const assignRole = useAssignUserRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const principal = Principal.fromText(principalId);
      await assignRole.mutateAsync({ principal, role });
      setSuccess(true);
      setPrincipalId('');
      setRole(UserRole.user);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to assign role');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover border-border">
        <DialogHeader className="border-b border-primary pb-4">
          <DialogTitle className="text-foreground">User Management</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Assign roles to users by their Principal ID
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="principalId" className="text-foreground">
              Principal ID *
            </Label>
            <Input
              id="principalId"
              placeholder="Enter user's Principal ID"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              required
              disabled={assignRole.isPending}
              className="bg-background border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground">
              Role *
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              disabled={assignRole.isPending}
            >
              <SelectTrigger id="role" className="bg-background border-border focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value={UserRole.admin}>Administrator</SelectItem>
                <SelectItem value={UserRole.user}>User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-success bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success-foreground">
                Role assigned successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={assignRole.isPending}
              className="flex-1 bg-secondary text-secondary-foreground border-border"
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={assignRole.isPending}
              className="flex-1 bg-primary text-primary-foreground"
            >
              {assignRole.isPending ? 'Assigning...' : 'Assign Role'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
