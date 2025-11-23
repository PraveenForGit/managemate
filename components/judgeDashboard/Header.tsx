
import { User } from '@/types';
import Image from 'next/image';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="header bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Image
          src="/image/logo-transparent-png.png"
          alt="ManageMate logo"
          width={204}
          height={190}
          className="object-contain"
        />
        <h1 className="text-xl font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          ManageMate
        </h1>
      </div>

      <div className="header-actions flex items-center gap-4">
        {user && (
          <>
            <div className="user-info flex items-center gap-2">
              <span>{user.name}</span>
              <span className="role-badge judge px-2 py-0.5 rounded text-xs font-semibold uppercase bg-yellow-400 text-black">
                Judge
              </span>
            </div>
            <button
              onClick={onLogout}
              className="btn btn-secondary bg-transparent border border-slate-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
