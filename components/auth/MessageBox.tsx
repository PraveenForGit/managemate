import React from 'react';

interface MessageBoxProps {
  message: { text: string; type: 'success' | 'error' | '' };
}

export function MessageBox({ message }: MessageBoxProps) {
  if (!message.text) return null;
  return (
    <div
      className={`mt-6 p-4 rounded-md text-center font-semibold ${
        message.type === 'success' ? 'bg-green-200 text-green-800 border border-green-600' : 'bg-red-200 text-red-800 border border-red-600'
      }`}
    >
      {message.text}
    </div>
  );
}
