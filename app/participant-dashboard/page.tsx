'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

import { Team, User, Submission, MentorRequest, LeaderboardItem } from '@/types';

import { Header } from '@/components/participantDashboard/Header';
import { Tabs } from '@/components/participantDashboard/Tabs';
import { TeamManagement } from '@/components/participantDashboard/TeamManagement';
import { SubmissionTab } from '@/components/participantDashboard/SubmissionTab';
import { MentorSupport } from '@/components/participantDashboard/MentorSupport';
import { Leaderboard } from '@/components/participantDashboard/Leaderboard';

type Tab = 'team' | 'submission' | 'mentor' | 'leaderboard';

const ParticipantDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('team');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamMembersInput, setTeamMembersInput] = useState('');
  const [submissionData, setSubmissionData] = useState({
    projectTitle: '',
    problemStatement: '',
    githubLink: '',
    deploymentLink: '',
    demoVideo: '',
    readme: '',
    buildLogs: ''
  });
  const [mentorRequestData, setMentorRequestData] = useState({
    category: '',
    description: ''
  });

  // Load current user from localStorage(Can connect any Database later)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      window.location.replace('/');
      return;
    }
    const user: User = JSON.parse(savedUser);
    if (user?.role !== 'participant') {
      window.location.replace('/');
      return;
    }
    setCurrentUser(user);
  }, []);

  // Loads participant data after currentUser is set
  useEffect(() => {
    if (!currentUser) return;

    const teams: Team[] = JSON.parse(localStorage.getItem('teams') || '[]');
    const team = teams.find(t => t.members.includes(currentUser.id));
    if (team) {
      setCurrentTeam(team);
      setTeamMembers(team.members);
    }

    const submissionsData: Submission[] = JSON.parse(localStorage.getItem('submissions') || '[]');
    if (team) {
      const teamSubmission = submissionsData.find(s => s.teamId === team.id);
      if (teamSubmission) setCurrentSubmission(teamSubmission);
    }
    setSubmissions(submissionsData);

    const requests: MentorRequest[] = JSON.parse(localStorage.getItem('mentorRequests') || '[]');
    if (team) {
      setMentorRequests(requests.filter(r => r.teamId === team.id));
    }

    setLeaderboard(calculateLeaderboard());
  }, [currentUser]);

  function calculateLeaderboard(): LeaderboardItem[] {
    const submissionsData: Submission[] = JSON.parse(localStorage.getItem('submissions') || '[]');
    const teamsData: Team[] = JSON.parse(localStorage.getItem('teams') || '[]');
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');

    const approvedSubs = submissionsData.filter(s => s.status === 'approved');

    const lb = approvedSubs.map(sub => {
      const subScores = scores.filter((score: any) => score.submissionId === sub.id);
      const totalScore = subScores.reduce((sum: number, s: any) => sum + s.total, 0);
      const avgScore = subScores.length === 0 ? 0 : totalScore / subScores.length;
      const team = teamsData.find(t => t.id === sub.teamId);

      return {
        submission: sub,
        team,
        averageScore: Math.round(avgScore * 100) / 100,
        judgeCount: subScores.length
      };
    }).sort((a, b) => b.averageScore - a.averageScore);

    return lb;
  }

  // --- Handlers ---

  function handleCreateTeam(name: string, members: string[]) {
    if (!name.trim() || !currentUser) return;
    const teams: Team[] = JSON.parse(localStorage.getItem('teams') || '[]');
    const newTeam: Team = {
      id: Date.now().toString(),
      name: name.trim(),
      members: [currentUser.id, ...members]
    };
    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));
    setCurrentTeam(newTeam);
    setTeamMembers(newTeam.members);
    setTeamNameInput('');
    setTeamMembersInput('');
  }

  function handleSubmissionChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSubmissionData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  }

  function handleSubmissionSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currentTeam || !currentUser) return;

    // Validates wheather all the required fields are submitted or not
    if (!submissionData.projectTitle || !submissionData.problemStatement || !submissionData.githubLink || !submissionData.readme) {
      alert('Please fill in all required fields.');
      return;
    }

    const submissions: Submission[] = JSON.parse(localStorage.getItem('submissions') || '[]');
    const newSubmission: Submission = {
      id: Date.now().toString(),
      teamId: currentTeam.id,
      userId: currentUser.id,
      projectTitle: submissionData.projectTitle,
      problemStatement: submissionData.problemStatement,
      githubLink: submissionData.githubLink,
      deploymentLink: submissionData.deploymentLink,
      demoVideo: submissionData.demoVideo,
      readme: submissionData.readme,
      buildLogs: submissionData.buildLogs,
      adminComments: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: ''
    };
    submissions.push(newSubmission);
    localStorage.setItem('submissions', JSON.stringify(submissions));
    setCurrentSubmission(newSubmission);
    alert('Project submitted successfully! Waiting for admin approval.');
  }

  function handleMentorRequestChange(e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) {
    setMentorRequestData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  }

  function handleMentorRequestSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currentTeam) return;
    if (!mentorRequestData.category || !mentorRequestData.description) {
      alert('Please fill in all fields.');
      return;
    }

    const requests: MentorRequest[] = JSON.parse(localStorage.getItem('mentorRequests') || '[]');
    const newRequest: MentorRequest = {
      id: Date.now().toString(),
      teamId: currentTeam.id,
      category: mentorRequestData.category,
      description: mentorRequestData.description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    localStorage.setItem('mentorRequests', JSON.stringify(requests));
    setMentorRequests(prev => [...prev, newRequest]);
    setMentorRequestData({ category: '', description: '' });
    alert('Mentor support request submitted!');
  }

  function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.replace('/');
  }

  return (
    <>
      <Header user={currentUser} onLogout={handleLogout} />
      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="p-6 max-w-5xl mx-auto">
        {activeTab === 'team' && (
          <section className="card bg-slate-800 border border-slate-700 rounded-md p-6">
            <h2 className="card-title text-2xl font-semibold mb-4">Team Management</h2>
            <TeamManagement currentTeam={currentTeam} teamMembers={teamMembers} onCreateTeam={handleCreateTeam} />
          </section>
        )}

        {activeTab === 'submission' && (
          <section className="card bg-slate-800 border border-slate-700 rounded-md p-6">
            <h2 className="card-title text-2xl font-semibold mb-4">Project Submission</h2>
            <SubmissionTab
              currentTeam={currentTeam}
              currentSubmission={currentSubmission}
              submissionData={submissionData}
              onSubmissionChange={handleSubmissionChange}
              onSubmissionSubmit={handleSubmissionSubmit}
              userExists={!!currentUser}
            />
          </section>
        )}

        {activeTab === 'mentor' && (
          <section className="card bg-slate-800 border border-slate-700 rounded-md p-6">
            <h2 className="card-title text-2xl font-semibold mb-4">Request Mentor Support</h2>
            <MentorSupport
              currentTeamExists={!!currentTeam}
              mentorRequests={mentorRequests}
              mentorData={mentorRequestData}
              onMentorChange={handleMentorRequestChange}
              onMentorSubmit={handleMentorRequestSubmit}
            />
          </section>
        )}

        {activeTab === 'leaderboard' && (
          <section className="card bg-slate-800 border border-slate-700 rounded-md p-6">
            <h2 className="card-title text-2xl font-semibold mb-4">🏆 Live Leaderboard</h2>
            <Leaderboard leaderboard={leaderboard} />
          </section>
        )}
      </main>
    </>
  );
};

export default ParticipantDashboardPage;
