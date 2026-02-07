import { useState, useEffect } from 'react';
import { useGetCompanySettings, useUpdateCompanySettings } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { CompanySettings } from '../../backend';

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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (companySettings) {
      setCompanyName(companySettings.companyName || '');
      setAddress(companySettings.address || '');
      setGstin(companySettings.gstin || '');
      setGstRate(companySettings.gstRate?.toString() || '');
      
      if (companySettings.logo) {
        const blob = new Blob([new Uint8Array(companySettings.logo.bytes)], { 
          type: companySettings.logo.mimeType 
        });
        const url = URL.createObjectURL(blob);
        setLogoPreview(url);
      }
    }
  }, [companySettings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (PNG or JPG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleSave = async () => {
    try {
      const rate = parseFloat(gstRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast.error('GST rate must be a number between 0 and 100');
        return;
      }

      let logoData: { bytes: Uint8Array; mimeType: string } | undefined;

      if (logoFile) {
        const arrayBuffer = await logoFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        logoData = {
          bytes,
          mimeType: logoFile.type,
        };
      } else if (companySettings?.logo) {
        logoData = {
          bytes: companySettings.logo.bytes,
          mimeType: companySettings.logo.mimeType,
        };
      }

      const settings: CompanySettings = {
        companyName: companyName.trim() || 'Degenix Graphics',
        address: address.trim(),
        gstin: gstin.trim(),
        gstRate: rate,
        logo: logoData,
      };

      await updateSettings.mutateAsync(settings);
      toast.success('Company settings updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to update company settings:', error);
      if (error.message?.includes('Unauthorized')) {
        toast.error('Only administrators can update company settings');
      } else {
        toast.error('Failed to update company settings');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Company Settings</DialogTitle>
          <DialogDescription>
            Configure company information, GST details, and upload your company logo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter company address"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="Enter GST Identification Number"
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
              placeholder="Enter GST rate (e.g., 18)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('logo')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <Input
                id="logo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleLogoChange}
                className="hidden"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 w-16 object-contain border border-border rounded"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a PNG or JPG image (max 5MB)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
