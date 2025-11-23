import React, { useState, FormEvent } from 'react';
import { Team } from '@/types';

interface TeamManagementProps {
  currentTeam: Team | null;
  teamMembers: string[];
  onCreateTeam: (teamName: string, members: string[]) => void;
}

export function TeamManagement({ currentTeam, teamMembers, onCreateTeam }: TeamManagementProps) {
  const [teamName, setTeamName] = useState('');
  const [membersInput, setMembersInput] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const members = membersInput.split(',').map(m => m.trim()).filter(Boolean);
    onCreateTeam(teamName, members);
    setTeamName('');
    setMembersInput('');
  }

  if (currentTeam) {
    return (
      <>
        <h3 className="mb-3">Your Team: <span>{currentTeam.name}</span></h3>
        <div className="team-members">
          <h4 className="text-lg font-semibold mb-2">Members:</h4>
          <ul className="list-disc list-inside">
            {teamMembers.map((member, idx) => (<li key={idx}>{member}</li>))}
          </ul>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-slate-400 mb-4">You are not part of a team yet. Create or join a team to get started.</p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="teamName" className="block font-semibold mb-1">Team Name</label>
          <input
            id="teamName"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
          />
        </div>
        <div>
          <label htmlFor="membersInput" className="block font-semibold mb-1">Team Members (comma-separated emails)</label>
          <input
            id="membersInput"
            value={membersInput}
            onChange={e => setMembersInput(e.target.value)}
            placeholder="member1@email.com, member2@email.com"
            className="w-full px-3 py-2 rounded border border-slate-600 bg-slate-900 text-slate-100"
          />
        </div>
        <button type="submit" className="btn-primary px-6 py-2 rounded font-bold text-white">Create Team</button>
      </form>
    </>
  );
}
