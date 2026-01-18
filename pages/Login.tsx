
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { mockDb } from '../services/mockDb';
import { User } from '../types';
import { Library, Sparkles, ShieldCheck, BookOpen, ArrowLeft, Mail, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

// --- Icons ---
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.48-1.02 1.58.11 2.92.83 3.75 1.99-3.23 1.76-2.67 6.12.59 7.35-.61 1.48-1.48 2.89-2.9 3.91zM12.03 7.25c-.25-2.19 2.05-4.14 4.07-4.25.32 2.38-2.35 4.38-4.07 4.25z"/>
  </svg>
);

type LoginStep = 'ROLE_SELECTION' | 'AUTH_METHOD';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('ROLE_SELECTION');
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'USER' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'GOOGLE' | 'APPLE' | 'EMAIL' | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (role: 'ADMIN' | 'USER') => {
    setSelectedRole(role);
    setStep('AUTH_METHOD');
  };

  const handleBack = () => {
    setStep('ROLE_SELECTION');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
  };

  const executeLogin = (method: 'GOOGLE' | 'APPLE' | 'EMAIL') => {
    if (!selectedRole) return;
    
    setAuthMethod(method);
    setIsLoading(true);

    // Simulate Network Request / Auth Provider Delay
    setTimeout(() => {
        const user = mockDb.login(selectedRole);
        onLogin(user);
        setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
      
      {/* --- Vibrant Background Gradient --- */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400 via-blue-600 to-indigo-900">
        {/* Soft lighting effects for depth */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-white/20 rounded-full blur-[120px] mix-blend-overlay animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/30 rounded-full blur-[100px] mix-blend-overlay" />
      </div>
      
      {/* --- Main Card (White Box) --- */}
      <div className="relative z-10 w-full max-w-[480px] mx-4 bg-white rounded-3xl shadow-2xl shadow-indigo-900/30 overflow-hidden transition-all duration-500 ease-in-out">
        
        {/* Loading Overlay */}
        {isLoading && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
                <div className="relative">
                    <div className="h-12 w-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                    </div>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
                    Authenticating via {authMethod === 'GOOGLE' ? 'Google' : authMethod === 'APPLE' ? 'Apple ID' : 'Email'}...
                </p>
            </div>
        )}

        {/* Content Container */}
        <div className="p-8 md:p-12">
          
          {/* Header (Logo & App Name) */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative h-16 w-16 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center text-white mb-4">
              <Library className="h-8 w-8" />
            </div>
            
            {/* Prominent App Name - Gradient Text */}
            <h1 className="text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 mb-2">
              Libri
            </h1>

            <div>
                {step === 'ROLE_SELECTION' ? (
                  <>
                    <h2 className="text-lg font-medium tracking-wide text-slate-900 leading-tight">
                        The Library for High-Growth Individuals
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 px-4 leading-relaxed font-light">
                        Curate personal wisdom and financial strategies in one intelligent, AI-driven library.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign In</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Log in as {selectedRole === 'ADMIN' ? 'Administrator' : 'Borrower'}
                    </p>
                  </>
                )}
            </div>
          </div>

          {/* STEP 1: ROLE SELECTION */}
          {step === 'ROLE_SELECTION' && (
             <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                <button 
                    onClick={() => handleRoleSelect('ADMIN')}
                    className="group w-full p-4 flex items-center gap-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-left"
                >
                    <div className="h-12 w-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Administrator</h3>
                        <p className="text-xs text-slate-500 group-hover:text-indigo-600 transition-colors">Manage catalog and users</p>
                    </div>
                </button>

                <button 
                    onClick={() => handleRoleSelect('USER')}
                    className="group w-full p-4 flex items-center gap-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                >
                    <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Borrower</h3>
                        <p className="text-xs text-slate-500 group-hover:text-blue-600 transition-colors">Browse and checkout books</p>
                    </div>
                </button>
             </div>
          )}

          {/* STEP 2: AUTH METHODS */}
          {step === 'AUTH_METHOD' && (
             <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                
                {/* Back Button */}
                <button 
                    onClick={handleBack}
                    className="absolute top-8 left-8 p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Button 
                        variant="outline" 
                        className="h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium"
                        onClick={() => executeLogin('GOOGLE')}
                    >
                        <GoogleIcon />
                        <span className="ml-2">Google</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium"
                        onClick={() => executeLogin('APPLE')}
                    >
                        <AppleIcon />
                        <span className="ml-2">Apple ID</span>
                    </Button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink-0 mx-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Or enter details</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {/* Traditional Form */}
                <div className="space-y-3">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Email address" 
                            className="pl-9 h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                            type="password" 
                            placeholder="Password" 
                            className="pl-9 h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <Button 
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200 transition-all hover:translate-y-[-1px]"
                        onClick={() => executeLogin('EMAIL')}
                        disabled={!email && !password} 
                    >
                        Sign In
                    </Button>
                </div>

             </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
            <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                System Secure v5.1
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
