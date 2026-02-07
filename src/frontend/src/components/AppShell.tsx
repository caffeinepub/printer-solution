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
import ProductsPage from '../pages/products/ProductsPage';
import AccountsPage from '../pages/accounts/AccountsPage';
import UserManagementDialog from './UserManagementDialog';
import CompanySettingsDialog from './company/CompanySettingsDialog';

export default function AppShell() {
  const { clear, identity } = useInternetIdentity();
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

  // Get display name - fallback to principal if no profile
  const displayName = userProfile?.name || identity?.getPrincipal().toString().slice(0, 8) + '...';
  const displayRole = isAdmin ? 'Administrator' : 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={logoUrl || "/assets/generated/degenix-graphics-logo.dim_512x512.png"}
                alt={companySettings?.companyName || "Degenix Graphics"}
                className="h-14 w-14 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  {companySettings?.companyName || "Degenix Graphics"}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Professional Print Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right px-3 py-2 rounded-lg bg-muted/50">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {displayRole}
                </p>
              </div>
              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCompanySettings(true)}
                    className="btn-interactive"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Company
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUserManagement(true)}
                    className="btn-interactive"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout} className="btn-interactive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="dashboard-tabs-list grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="clients" className="dashboard-tab-trigger">Clients</TabsTrigger>
            <TabsTrigger value="quotations" className="dashboard-tab-trigger">Quotations</TabsTrigger>
            <TabsTrigger value="products" className="dashboard-tab-trigger">Products</TabsTrigger>
            <TabsTrigger value="inventory" className="dashboard-tab-trigger">Inventory</TabsTrigger>
            <TabsTrigger value="billing" className="dashboard-tab-trigger">Billing</TabsTrigger>
            <TabsTrigger value="accounts" className="dashboard-tab-trigger">Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-0">
            <div className="page-surface p-6">
              <ClientsPage />
            </div>
          </TabsContent>

          <TabsContent value="quotations" className="mt-0">
            <div className="page-surface p-6">
              <QuotationsPage />
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-0">
            <div className="page-surface p-6">
              <ProductsPage />
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-0">
            <div className="page-surface p-6">
              <InventoryPage />
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-0">
            <div className="page-surface p-6">
              <BillingPage />
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="mt-0">
            <div className="page-surface p-6">
              <AccountsPage />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026. Built with <Heart className="inline h-4 w-4 text-primary fill-primary" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
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
