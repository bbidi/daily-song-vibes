
import React, { useState } from 'react';
import { Music, Mail, Lock, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        let errorMessage = "An error occurred. Please try again.";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "An account with this email already exists. Please sign in instead.";
        } else if (error.message.includes('Password')) {
          errorMessage = "Password must be at least 6 characters long.";
        }
        
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (!isLogin) {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppleAuth = () => {
    toast({
      title: "Coming Soon",
      description: "Apple authentication will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MusicLocket</h1>
          <p className="text-white/60">Share your daily soundtrack with friends</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12"
              />
            </div>

            {/* Email Auth Button */}
            <Button
              onClick={handleEmailAuth}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">or</span>
              </div>
            </div>

            {/* Apple ID Button */}
            <Button
              onClick={handleAppleAuth}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 h-12"
            >
              <Apple className="w-5 h-5 mr-2" />
              Continue with Apple
            </Button>

            {/* Toggle Login/Signup */}
            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/60 hover:text-white text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            Share one song per day with friends
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            Connect with Spotify and Apple Music
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <div className="w-2 h-2 bg-indigo-400 rounded-full" />
            Discover new music through your network
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
