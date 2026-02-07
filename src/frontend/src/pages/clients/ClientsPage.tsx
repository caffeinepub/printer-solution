import { useState } from 'react';
import { useGetAllClients, useDeleteClient } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import ClientFormDialog from '../../components/clients/ClientFormDialog';
import ClientDetailDialog from '../../components/clients/ClientDetailDialog';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import type { Client } from '../../backend';

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useGetAllClients();
  const deleteClient = useDeleteClient();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deletingClient) {
      await deleteClient.mutateAsync(deletingClient.id);
      setDeletingClient(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>Manage your clients and their information</CardDescription>
            </div>
            <Button onClick={handleAdd} className="btn-interactive">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No clients yet</p>
              <Button onClick={handleAdd} variant="outline" className="btn-interactive">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Client
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Details</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id.toString()} className="row-interactive">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.contactDetails}</TableCell>
                    <TableCell>{client.address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingClient(client)}
                          className="btn-interactive"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client)}
                          className="btn-interactive"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingClient(client)}
                          className="btn-interactive"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <ClientFormDialog
          open={showForm}
          onOpenChange={setShowForm}
          client={editingClient}
        />
      )}

      {viewingClient && (
        <ClientDetailDialog
          open={!!viewingClient}
          onOpenChange={(open) => !open && setViewingClient(null)}
          client={viewingClient}
        />
      )}

      <ConfirmDialog
        open={!!deletingClient}
        onOpenChange={(open) => !open && setDeletingClient(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        description={`Are you sure you want to delete ${deletingClient?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteClient.isPending}
      />
    </>
  );
}
