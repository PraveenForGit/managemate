'use client';

import React, { useState, FormEvent } from 'react';

import { TabToggle } from '@/components/auth/TabToggle';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { MessageBox } from '@/components/auth/MessageBox';
import { useRouter } from 'next/navigation';

type Role = 'participant' | 'admin' | 'judge' | '';

export default function AuthPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<Role>('');

  // Signup states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<Role>('');

  // Message state
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  // Helpers to save and read users
  const getUsers = (): any[] => {
    if (typeof window === 'undefined') return [];
    const usersJson = localStorage.getItem('users') || '[]';
    return JSON.parse(usersJson);
  };

  const setUsers = (users: any[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword || !loginRole) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }
    const users = getUsers();
    const user = users.find((u: any) => u.email === loginEmail && u.role === loginRole);
    if (!user || user.password !== loginPassword) {
      setMessage({ text: 'Invalid credentials', type: 'error' });
      return;
    }
    const currentUser = { ...user };
    delete currentUser.password;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
    setTimeout(() => router.push(`/${loginRole}-dashboard`), 1000);
  };

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupRole) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }
    if (signupPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    const users = getUsers();
    if (users.some((u: any) => u.email === signupEmail)) {
      setMessage({ text: 'Email already registered', type: 'error' });
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: signupRole,
    };
    users.push(newUser);
    setUsers(users);
    setMessage({ text: 'Account created successfully! Please login.', type: 'success' });
    setTimeout(() => setActiveTab('login'), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-radial from-indigo-500/10 to-transparent animate-spin-slow rounded-full"></div>
      <div className="relative bg-slate-800 bg-opacity-95 border border-indigo-600 rounded-3xl p-12 max-w-md w-full shadow-lg backdrop-blur-md z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">ManageMate</h1>
          <p className="text-slate-400">Your aid in management</p>
        </header>

        <TabToggle activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'login' ? (
          <LoginForm
            email={loginEmail}
            password={loginPassword}
            role={loginRole}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onRoleChange={setLoginRole}
            onSubmit={handleLogin}
          />
        ) : (
          <SignupForm
            name={signupName}
            email={signupEmail}
            password={signupPassword}
            role={signupRole}
            onNameChange={setSignupName}
            onEmailChange={setSignupEmail}
            onPasswordChange={setSignupPassword}
            onRoleChange={setSignupRole}
            onSubmit={handleSignup}
          />
        )}

        <MessageBox message={message} />
      </div>
    </div>
  );
}
