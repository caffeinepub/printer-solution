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
import { Client } from '../../backend';

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
}

export default function ClientFormDialog({ open, onOpenChange, client }: ClientFormDialogProps) {
  const [name, setName] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [address, setAddress] = useState('');

  const addClient = useAddClient();
  const updateClient = useUpdateClient();

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
  }, [client, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (client) {
        await updateClient.mutateAsync({
          id: client.id,
          name,
          contactDetails,
          address,
        });
      } else {
        await addClient.mutateAsync({ name, contactDetails, address });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  };

  const isPending = addClient.isPending || updateClient.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-popover border-border">
        <DialogHeader className="border-b border-primary pb-4">
          <DialogTitle className="text-foreground">
            {client ? 'Edit Client' : 'Add New Client'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {client ? 'Update client information' : 'Enter client details to add them to your system'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Client Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter client name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isPending}
              className="bg-background border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact" className="text-foreground">
              Contact Details *
            </Label>
            <Input
              id="contact"
              placeholder="Phone, email, etc."
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              required
              disabled={isPending}
              className="bg-background border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">
              Address *
            </Label>
            <Textarea
              id="address"
              placeholder="Enter full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={isPending}
              rows={3}
              className="resize-none bg-background border-border focus-visible:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 bg-secondary text-secondary-foreground border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary text-primary-foreground"
            >
              {isPending ? 'Saving...' : client ? 'Update Client' : 'Add Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
