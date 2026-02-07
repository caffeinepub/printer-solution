import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/degenix-graphics-logo.dim_512x512.png"
              alt="Degenix Graphics"
              className="h-20 w-20 object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Degenix Graphics
          </CardTitle>
          <CardDescription className="text-base">
            Professional Print Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Sign in with Internet Identity to access your account
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {isLoggingIn ? (
                <>Logging in...</>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Secure authentication powered by Internet Computer
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
