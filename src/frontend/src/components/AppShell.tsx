import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetCompanySettings } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Heart, Settings } from 'lucide-react';
import ClientsPage from '../pages/clients/ClientsPage';
import QuotationsPage from '../pages/quotations/QuotationsPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import BillingPage from '../pages/billing/BillingPage';
import UserManagementDialog from './UserManagementDialog';
import CompanySettingsDialog from './company/CompanySettingsDialog';

export default function AppShell() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: companySettings } = useGetCompanySettings();
  const [activeTab, setActiveTab] = useState('clients');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showCompanySettings, setShowCompanySettings] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Convert company logo bytes to URL
  useEffect(() => {
    if (companySettings?.logo) {
      const blob = new Blob([new Uint8Array(companySettings.logo.bytes)], { 
        type: companySettings.logo.mimeType 
      });
      const url = URL.createObjectURL(blob);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoUrl(null);
    }
  }, [companySettings]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={logoUrl || "/assets/generated/degenix-graphics-logo.dim_512x512.png"}
                alt={companySettings?.companyName || "Degenix Graphics"}
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {companySettings?.companyName || "Degenix Graphics"}
                </h1>
                <p className="text-sm text-muted-foreground">Professional Print Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {userProfile && (
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin ? 'Administrator' : 'User'}
                  </p>
                </div>
              )}
              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCompanySettings(true)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Company Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUserManagement(true)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="clients">Client Management</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-0">
            <ClientsPage />
          </TabsContent>

          <TabsContent value="quotations" className="mt-0">
            <QuotationsPage />
          </TabsContent>

          <TabsContent value="inventory" className="mt-0">
            <InventoryPage />
          </TabsContent>

          <TabsContent value="billing" className="mt-0">
            <BillingPage />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026. Built with <Heart className="inline h-4 w-4 text-primary fill-primary" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {showUserManagement && (
        <UserManagementDialog
          open={showUserManagement}
          onOpenChange={setShowUserManagement}
        />
      )}

      {showCompanySettings && (
        <CompanySettingsDialog
          open={showCompanySettings}
          onOpenChange={setShowCompanySettings}
        />
      )}
    </div>
  );
}
