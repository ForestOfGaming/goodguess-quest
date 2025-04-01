
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Logo from '@/components/Logo';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !loading) {
      navigate('/categories');
    }
  }, [user, loading, navigate]);
  
  // Sign In Form
  const [signInFormData, setSignInFormData] = useState({
    email: '',
    password: ''
  });
  
  // Sign Up Form
  const [signUpFormData, setSignUpFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInFormData.email || !signInFormData.password) return;
    
    setIsLoading(true);
    try {
      await signIn(signInFormData.email, signInFormData.password);
      navigate('/categories');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpFormData.email || !signUpFormData.password || !signUpFormData.username) return;
    
    setIsLoading(true);
    try {
      await signUp(signUpFormData.email, signUpFormData.password, signUpFormData.username);
      // Not navigating here as we want users to check their email first
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-goodguess-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={signInFormData.email}
                    onChange={(e) => setSignInFormData({...signInFormData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input 
                    id="signin-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={signInFormData.password}
                    onChange={(e) => setSignInFormData({...signInFormData, password: e.target.value})}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-goodguess-primary hover:bg-goodguess-primary-dark"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center">Create Account</h2>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={signUpFormData.email}
                    onChange={(e) => setSignUpFormData({...signUpFormData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input 
                    id="signup-username" 
                    type="text" 
                    placeholder="cooluser123" 
                    value={signUpFormData.username}
                    onChange={(e) => setSignUpFormData({...signUpFormData, username: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={signUpFormData.password}
                    onChange={(e) => setSignUpFormData({...signUpFormData, password: e.target.value})}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-goodguess-primary hover:bg-goodguess-primary-dark"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Auth;
