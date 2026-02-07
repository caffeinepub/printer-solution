import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, loginError } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/generated/degenix-graphics-logo.dim_512x512.png"
              alt="Degenix Graphics"
              className="h-24 w-24 object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Degenix Graphics</CardTitle>
            <CardDescription className="text-base mt-2">
              Professional Print Management System
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError.message}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleLogin} 
            className="w-full" 
            disabled={isLoggingIn}
            size="lg"
          >
            {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Secure authentication powered by Internet Computer
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
