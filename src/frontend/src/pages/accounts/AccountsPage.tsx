import { useState, useEffect } from 'react';
import { useGetCompanySettings, useUpdateCompanySettings, useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountsPage() {
  const { data: companySettings, isLoading } = useGetCompanySettings();
  const { data: isAdmin } = useIsCallerAdmin();
  const updateSettings = useUpdateCompanySettings();

  const [pan, setPan] = useState('');
  const [cin, setCin] = useState('');
  const [gstin, setGstin] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressLine3, setAddressLine3] = useState('');
  const [placeOfWork, setPlaceOfWork] = useState('');

  useEffect(() => {
    if (companySettings) {
      setPan(companySettings.pan || '');
      setCin(companySettings.cin || '');
      setGstin(companySettings.gstin || '');
      setGstRate(companySettings.gstRate?.toString() || '18');
      setAddressLine1(companySettings.addressLine1 || '');
      setAddressLine2(companySettings.addressLine2 || '');
      setAddressLine3(companySettings.addressLine3 || '');
      setPlaceOfWork(companySettings.placeOfWork || '');
    }
  }, [companySettings]);

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('Only administrators can update account settings');
      return;
    }

    const rate = parseFloat(gstRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error('GST rate must be a number between 0 and 100');
      return;
    }

    try {
      await updateSettings.mutateAsync({
        companyName: companySettings?.companyName || 'Degenix Graphics',
        address: companySettings?.address || '',
        gstin: gstin.trim(),
        gstRate: rate,
        pan: pan.trim(),
        cin: cin.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        addressLine3: addressLine3.trim(),
        placeOfWork: placeOfWork.trim(),
        logo: companySettings?.logo,
      });
      toast.success('Account settings updated successfully');
    } catch (error) {
      toast.error('Failed to update account settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage India-specific accounting details</CardDescription>
          </div>
          {isAdmin && (
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending}
              className="btn-interactive"
            >
              <Save className="mr-2 h-4 w-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pan">PAN (Permanent Account Number)</Label>
              <Input
                id="pan"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="ABCDE1234F"
                disabled={!isAdmin}
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cin">CIN (Corporate Identity Number)</Label>
              <Input
                id="cin"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="U12345AB2020PTC123456"
                disabled={!isAdmin}
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN (GST Identification Number)</Label>
              <Input
                id="gstin"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="22AAAAA0000A1Z5"
                disabled={!isAdmin}
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input
                id="gstRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                disabled={!isAdmin}
                className="focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Building/Street"
                  disabled={!isAdmin}
                  className="focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Area/Locality"
                  disabled={!isAdmin}
                  className="focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine3">Address Line 3</Label>
                <Input
                  id="addressLine3"
                  value={addressLine3}
                  onChange={(e) => setAddressLine3(e.target.value)}
                  placeholder="City, State, PIN"
                  disabled={!isAdmin}
                  className="focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfWork">Place of Work</Label>
                <Input
                  id="placeOfWork"
                  value={placeOfWork}
                  onChange={(e) => setPlaceOfWork(e.target.value)}
                  placeholder="City/Location"
                  disabled={!isAdmin}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          {!isAdmin && (
            <p className="text-sm text-muted-foreground">
              Only administrators can modify account settings.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
