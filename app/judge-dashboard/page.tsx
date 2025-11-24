'use client';

import React, { useState, useEffect, FormEvent } from 'react';

import { User, Submission, Team, Score, LeaderboardItem } from '@/types';

import { Header } from '@/components/judgeDashboard/Header';
import { Tabs } from '@/components/judgeDashboard/Tabs';
import { ProjectsList } from '@/components/judgeDashboard/ProjectsList';
import { Leaderboard } from '@/components/judgeDashboard/Leaderboard';
import { ScoringModal } from '@/components/judgeDashboard/ScoringModal';

type Tab = 'projects' | 'leaderboard';

export default function JudgeDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [sortFilter, setSortFilter] = useState<'all' | 'scored' | 'unscored'>('all');
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [scoringSubmission, setScoringSubmission] = useState<Submission | null>(null);
  const [scoreFormData, setScoreFormData] = useState({
    innovation: '',
    uiux: '',
    impact: '',
    technical: '',
    completion: '',
    comments: ''
  });

  // Authentication & initialization of users
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      window.location.replace('/');
      return;
    }
    const user: User = JSON.parse(savedUser);
    if (!user || user.role !== 'judge') {
      window.location.replace('/');
      return;
    }
    setCurrentUser(user);
  }, []);

  // filter for leaderboard
  useEffect(() => {
    if (!currentUser) return;
    const allSubmissions: Submission[] = JSON.parse(localStorage.getItem('submissions') || '[]');
    const approvedSubmissions = allSubmissions.filter(submission => submission.status === 'approved');
    const allTeams: Team[] = JSON.parse(localStorage.getItem('teams') || '[]');
    const allScores: Score[] = JSON.parse(localStorage.getItem('scores') || '[]');

    setSubmissions(approvedSubmissions);
    setTeams(allTeams);
    setScores(allScores);

    applyFilter(approvedSubmissions, allScores, currentUser.id);
    loadLeaderboard(approvedSubmissions, allTeams, allScores);
  }, [currentUser, sortFilter]);

  // Filter submissions based on scored/unscored/all status for current judge
  function applyFilter(subs: Submission[], scores: Score[], judgeId: string) {
    let filtered = subs;
    if (sortFilter === 'scored') {
      filtered = subs.filter(sub => scores.some(s => s.submissionId === sub.id && s.judgeId === judgeId));
    } else if (sortFilter === 'unscored') {
      filtered = subs.filter(sub => !scores.some(s => s.submissionId === sub.id && s.judgeId === judgeId));
    }
    setFilteredSubmissions(filtered);
  }

  // Calculate leaderboard from submissions, teams, and scores
  function loadLeaderboard(allSubs: Submission[], allTeams: Team[], allScores: Score[]) {
    const approvedSubs = allSubs; 
    const lb = approvedSubs.map(sub => {
      const subScores = allScores.filter(s => s.submissionId === sub.id);
      const totalScore = subScores.reduce((sum, s) => sum + s.total, 0);
      const avgScore = subScores.length === 0 ? 0 : totalScore / subScores.length;
      const team = allTeams.find(t => t.id === sub.teamId);
      return {
        submission: sub,
        team,
        averageScore: Math.round(avgScore * 100) / 100,
        judgeCount: subScores.length
      };
    }).sort((a, b) => b.averageScore - a.averageScore);
    setLeaderboard(lb);
  }

  
  function openScoring(submission: Submission) {
    setScoringSubmission(submission);
    const existingScore = scores.find(s => s.submissionId === submission.id && s.judgeId === currentUser?.id);
    if (existingScore) {
      setScoreFormData({
        innovation: existingScore.scores.innovation.toString(),
        uiux: existingScore.scores.uiux.toString(),
        impact: existingScore.scores.impact.toString(),
        technical: existingScore.scores.technical.toString(),
        completion: existingScore.scores.completion.toString(),
        comments: existingScore.comments || ''
      });
    } else {
      setScoreFormData({
        innovation: '',
        uiux: '',
        impact: '',
        technical: '',
        completion: '',
        comments: ''
      });
    }
  }

  
  function closeScoring() {
    setScoringSubmission(null);
    setScoreFormData({
      innovation: '',
      uiux: '',
      impact: '',
      technical: '',
      completion: '',
      comments: ''
    });
  }

  // Handle input change for scoring form
  function handleScoreChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target;
    setScoreFormData(prev => ({ ...prev, [id]: value }));
  }

  // Updated score submission by judge
  function submitScore(e: FormEvent) {
    e.preventDefault();
    if (!scoringSubmission || !currentUser) return;

    const scoresParsed = {
      innovation: Number(scoreFormData.innovation),
      uiux: Number(scoreFormData.uiux),
      impact: Number(scoreFormData.impact),
      technical: Number(scoreFormData.technical),
      completion: Number(scoreFormData.completion),
    };

    const total = Object.values(scoresParsed).reduce((a, b) => a + b, 0);

    if (total > 100) {
      alert('Total score cannot exceed 100 points!');
      return;
    }

    const updatedScores = [...scores];

    const existingIndex = scores.findIndex(s => s.submissionId === scoringSubmission.id && s.judgeId === currentUser.id);

    const scoreData: Score = {
      id: existingIndex !== -1 ? updatedScores[existingIndex].id : Date.now().toString(),
      submissionId: scoringSubmission.id,
      judgeId: currentUser.id,
      scores: scoresParsed,
      total,
      comments: scoreFormData.comments
    };

    if (existingIndex !== -1) {
      updatedScores[existingIndex] = scoreData;
    } else {
      updatedScores.push(scoreData);
    }

    localStorage.setItem('scores', JSON.stringify(updatedScores));
    setScores(updatedScores);
    applyFilter(submissions, updatedScores, currentUser.id);
    loadLeaderboard(submissions, teams, updatedScores);
    closeScoring();
    alert('Score submitted successfully!');
  }

  // Logout 
  function logout() {
    localStorage.removeItem('currentUser');
    window.location.replace('/?logout=true');
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header user={currentUser} onLogout={logout} />

      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <main className="p-6 max-w-5xl mx-auto">
        {activeTab === 'projects' && (
          <ProjectsList
            submissions={filteredSubmissions}
            teams={teams}
            scores={scores}
            currentUserId={currentUser?.id!}
            sortFilter={sortFilter}
            onEvaluateClick={openScoring}
          />
        )}

        {activeTab === 'leaderboard' && <Leaderboard leaderboard={leaderboard} />}
      </main>

      {scoringSubmission && (
        <ScoringModal
          submission={scoringSubmission}
          formData={scoreFormData}
          onFormChange={handleScoreChange}
          onSubmit={submitScore}
          onClose={closeScoring}
        />
      )}
    </div>
  );
}
