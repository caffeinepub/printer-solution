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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload } from 'lucide-react';

interface CompanySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CompanySettingsDialog({ open, onOpenChange }: CompanySettingsDialogProps) {
  const { data: companySettings } = useGetCompanySettings();
  const updateSettings = useUpdateCompanySettings();

  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [gstRate, setGstRate] = useState('');
  const [pan, setPan] = useState('');
  const [cin, setCin] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressLine3, setAddressLine3] = useState('');
  const [placeOfWork, setPlaceOfWork] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (companySettings) {
      setCompanyName(companySettings.companyName);
      setAddress(companySettings.address);
      setGstin(companySettings.gstin);
      setGstRate(companySettings.gstRate.toString());
      setPan(companySettings.pan);
      setCin(companySettings.cin);
      setAddressLine1(companySettings.addressLine1);
      setAddressLine2(companySettings.addressLine2);
      setAddressLine3(companySettings.addressLine3);
      setPlaceOfWork(companySettings.placeOfWork);

      if (companySettings.logo) {
        const blob = new Blob([new Uint8Array(companySettings.logo.bytes)], {
          type: companySettings.logo.mimeType,
        });
        const url = URL.createObjectURL(blob);
        setLogoPreview(url);
      }
    }
  }, [companySettings, open]);

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
    try {
      let logoData = companySettings?.logo;

      if (logoFile) {
        const arrayBuffer = await logoFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        logoData = {
          bytes,
          mimeType: logoFile.type,
        };
      }

      await updateSettings.mutateAsync({
        companyName,
        address,
        gstin,
        gstRate: parseFloat(gstRate),
        pan,
        cin,
        addressLine1,
        addressLine2,
        addressLine3,
        placeOfWork,
        logo: logoData,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update company settings:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-popover border-border">
        <DialogHeader className="border-b border-primary pb-4">
          <DialogTitle className="text-foreground">Company Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your company information and GST details
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-foreground">
                Company Name *
              </Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={updateSettings.isPending}
                className="bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground">
                Address *
              </Label>
              <Textarea
                id="address"
                placeholder="Enter company address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                disabled={updateSettings.isPending}
                rows={2}
                className="resize-none bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1" className="text-foreground">
                  Address Line 1 *
                </Label>
                <Input
                  id="addressLine1"
                  placeholder="Street"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                  disabled={updateSettings.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2" className="text-foreground">
                  Address Line 2 *
                </Label>
                <Input
                  id="addressLine2"
                  placeholder="City"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  required
                  disabled={updateSettings.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine3" className="text-foreground">
                  Address Line 3 *
                </Label>
                <Input
                  id="addressLine3"
                  placeholder="State, PIN"
                  value={addressLine3}
                  onChange={(e) => setAddressLine3(e.target.value)}
                  required
                  disabled={updateSettings.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeOfWork" className="text-foreground">
                Place of Work *
              </Label>
              <Input
                id="placeOfWork"
                placeholder="Enter place of work"
                value={placeOfWork}
                onChange={(e) => setPlaceOfWork(e.target.value)}
                required
                disabled={updateSettings.isPending}
                className="bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstin" className="text-foreground">
                  GSTIN *
                </Label>
                <Input
                  id="gstin"
                  placeholder="Enter GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  required
                  disabled={updateSettings.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstRate" className="text-foreground">
                  GST Rate (%) *
                </Label>
                <Input
                  id="gstRate"
                  type="number"
                  step="0.01"
                  placeholder="18.0"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  required
                  disabled={updateSettings.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pan" className="text-foreground">
                  PAN *
                </Label>
                <Input
                  id="pan"
                  placeholder="Enter PAN"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  required
                  disabled={updateSettings.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cin" className="text-foreground">
                  CIN *
                </Label>
                <Input
                  id="cin"
                  placeholder="Enter CIN"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  required
                  disabled={updateSettings.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo" className="text-foreground">
                Company Logo
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={updateSettings.isPending}
                  className="flex-1 bg-background border-border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={updateSettings.isPending}
                  onClick={() => document.getElementById('logo')?.click()}
                  className="bg-secondary text-secondary-foreground border-border"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {logoPreview && (
                <div className="mt-2 p-4 border rounded-lg bg-muted border-border">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-20 w-20 object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateSettings.isPending}
                className="flex-1 bg-secondary text-secondary-foreground border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateSettings.isPending}
                className="flex-1 bg-primary text-primary-foreground"
              >
                {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
