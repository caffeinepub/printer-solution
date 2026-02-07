import { useState, useEffect } from 'react';
import { useAddClient, useUpdateClient } from '../../hooks/useQueries';
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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Client } from '../../backend';

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
}

export default function ClientFormDialog({ open, onOpenChange, client }: ClientFormDialogProps) {
  const [name, setName] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const addClient = useAddClient();
  const updateClient = useUpdateClient();

  const isEditing = !!client;
  const mutation = isEditing ? updateClient : addClient;

  useEffect(() => {
    if (client) {
      setName(client.name);
      setContactDetails(client.contactDetails);
      setAddress(client.address);
    } else {
      setName('');
      setContactDetails('');
      setAddress('');
    }
    setError('');
  }, [client, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !contactDetails.trim() || !address.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      if (isEditing) {
        await updateClient.mutateAsync({
          id: client.id,
          name: name.trim(),
          contactDetails: contactDetails.trim(),
          address: address.trim(),
        });
      } else {
        await addClient.mutateAsync({
          name: name.trim(),
          contactDetails: contactDetails.trim(),
          address: address.trim(),
        });
      }
      onOpenChange(false);
    } catch (err) {
      setError('Failed to save client. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update client information' : 'Enter client details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name *</Label>
            <Input
              id="name"
              placeholder="Enter client name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Details *</Label>
            <Input
              id="contact"
              placeholder="Phone, email, etc."
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={mutation.isPending}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="flex-1">
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Add Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
