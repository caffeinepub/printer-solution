import { useState, useEffect } from 'react';
import { useGetCompanySettings, useUpdateCompanySettings } from '../../hooks/useQueries';
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
import { AlertCircle, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CompanyLogo } from '../../backend';

interface CompanySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CompanySettingsDialog({ open, onOpenChange }: CompanySettingsDialogProps) {
  const { data: settings } = useGetCompanySettings();
  const updateSettings = useUpdateCompanySettings();

  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [pan, setPan] = useState('');
  const [cin, setCin] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressLine3, setAddressLine3] = useState('');
  const [placeOfWork, setPlaceOfWork] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName);
      setAddress(settings.address);
      setGstin(settings.gstin);
      setGstRate(settings.gstRate.toString());
      setPan(settings.pan);
      setCin(settings.cin);
      setAddressLine1(settings.addressLine1);
      setAddressLine2(settings.addressLine2);
      setAddressLine3(settings.addressLine3);
      setPlaceOfWork(settings.placeOfWork);

      if (settings.logo) {
        const blob = new Blob([new Uint8Array(settings.logo.bytes)], { type: settings.logo.mimeType });
        const url = URL.createObjectURL(blob);
        setLogoPreview(url);
      }
    }
  }, [settings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }

    try {
      let logoData: CompanyLogo | undefined = settings?.logo;

      if (logoFile) {
        const arrayBuffer = await logoFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        logoData = {
          bytes,
          mimeType: logoFile.type,
        };
      }

      await updateSettings.mutateAsync({
        companyName: companyName.trim(),
        address: address.trim(),
        gstin: gstin.trim(),
        gstRate: parseFloat(gstRate),
        pan: pan.trim(),
        cin: cin.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        addressLine3: addressLine3.trim(),
        placeOfWork: placeOfWork.trim(),
        logo: logoData,
      });

      onOpenChange(false);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-surface max-w-2xl max-h-[90vh]">
        <DialogHeader className="dialog-header">
          <DialogTitle>Company Settings</DialogTitle>
          <DialogDescription>
            Update your company information and branding
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={updateSettings.isPending}
                className="input-focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  disabled={updateSettings.isPending}
                  className="btn-interactive"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="h-12 w-12 object-contain border rounded" />
                )}
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={updateSettings.isPending}
                rows={2}
                className="input-focus"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  disabled={updateSettings.isPending}
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstRate">GST Rate (%)</Label>
                <Input
                  id="gstRate"
                  type="number"
                  step="0.01"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  disabled={updateSettings.isPending}
                  className="input-focus"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pan">PAN</Label>
                <Input
                  id="pan"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  disabled={updateSettings.isPending}
                  className="input-focus"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cin">CIN</Label>
                <Input
                  id="cin"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  disabled={updateSettings.isPending}
                  className="input-focus"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                disabled={updateSettings.isPending}
                className="input-focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                disabled={updateSettings.isPending}
                className="input-focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine3">Address Line 3</Label>
              <Input
                id="addressLine3"
                value={addressLine3}
                onChange={(e) => setAddressLine3(e.target.value)}
                disabled={updateSettings.isPending}
                className="input-focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeOfWork">Place of Work</Label>
              <Input
                id="placeOfWork"
                value={placeOfWork}
                onChange={(e) => setPlaceOfWork(e.target.value)}
                disabled={updateSettings.isPending}
                className="input-focus"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateSettings.isPending}
                className="flex-1 btn-interactive"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateSettings.isPending} className="flex-1 btn-interactive">
                {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
