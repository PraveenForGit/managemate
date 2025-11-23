import React, { FormEvent } from 'react';

type Role = 'participant' | 'admin' | 'judge' | '';

interface LoginFormProps {
  email: string;
  password: string;
  role: Role;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRoleChange: (value: Role) => void;
  onSubmit: (e: FormEvent) => void;
}

export function LoginForm({ email, password, role, onEmailChange, onPasswordChange, onRoleChange, onSubmit }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="loginEmail" className="block mb-1 font-semibold text-slate-300">Email</label>
        <input
          id="loginEmail"
          type="email"
          required
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="loginPassword" className="block mb-1 font-semibold text-slate-300">Password</label>
        <input
          id="loginPassword"
          type="password"
          required
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="loginRole" className="block mb-1 font-semibold text-slate-300">Role</label>
        <select
          id="loginRole"
          required
          value={role}
          onChange={e => onRoleChange(e.target.value as Role)}
          className="w-full px-4 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Select Role</option>
          <option value="participant">Participant</option>
          <option value="admin">Admin</option>
          <option value="judge">Judge</option>
        </select>
      </div>
      <button type="submit" className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-600 rounded-md font-bold text-white hover:shadow-lg transition">Login</button>
    </form>
  );
}
