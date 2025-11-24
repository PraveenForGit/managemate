'use client';

import React, { useState, useEffect } from 'react';

import { User, SubmissionAdmin, Announcement, LeaderboardItem } from '@/types';

import { Header } from '@/components/adminDashboard/Header';
import { Tabs } from '@/components/adminDashboard/Tabs';
import { SubmissionList } from '@/components/adminDashboard/SubmissionList';
import { JudgesList } from '@/components/adminDashboard/JudgesList';
import { AnnouncementsForm } from '@/components/adminDashboard/AnnouncementsForm';
import { AnnouncementsList } from '@/components/adminDashboard/AnnouncementsList';
import { Leaderboard } from '@/components/adminDashboard/Leaderboard';
import { ReviewModal } from '@/components/adminDashboard/ReviewModal';

type SubmissionStatus = 'all' | 'pending' | 'approved' | 'rejected';
type Tab = 'submissions' | 'judges' | 'timeline' | 'leaderboard';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('submissions');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Data states is here
  const [submissions, setSubmissions] = useState<SubmissionAdmin[]>([]);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus>('all');
  const [judges, setJudges] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  // Review modal is here
  const [reviewSubmission, setReviewSubmission] = useState<SubmissionAdmin | null>(null);
  const [adminComments, setAdminComments] = useState<string>('');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      window.location.replace('/');
      return;
    }
    const user: User = JSON.parse(savedUser);
    if (user?.role !== 'admin') {
      window.location.replace('/');
      return;
    }
    setCurrentUser(user);

    loadSubmissions();
    loadJudges();
    loadAnnouncements();
    loadLeaderboard();
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  function loadSubmissions() {
    const allSubs: SubmissionAdmin[] = JSON.parse(localStorage.getItem('submissions') || '[]');
    if (statusFilter === 'all') {
      setSubmissions(allSubs);
    } else {
      setSubmissions(allSubs.filter(s => s.status === statusFilter));
    }
  }

  function loadJudges() {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    setJudges(users.filter(u => u.role === 'judge'));
  }

  function loadAnnouncements() {
    const data: Announcement[] = JSON.parse(localStorage.getItem('announcements') || '[]');
    setAnnouncements(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  function loadLeaderboard() {
    const submissions: SubmissionAdmin[] = JSON.parse(localStorage.getItem('submissions') || '[]');
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');

    const approvedSubs = submissions.filter(s => s.status === 'approved');

    const lb = approvedSubs.map(sub => {
      const subScores = scores.filter((score: any) => score.submissionId === sub.id);
      const totalScore = subScores.reduce((sum: any, s: any) => sum + s.total, 0);
      const avgScore = subScores.length === 0 ? 0 : totalScore / subScores.length;
      const teamName = teams.find((t: any) => t.id === sub.teamId)?.name || 'Unknown Team';

      return {
        submission: sub,
        teamName,
        averageScore: Math.round(avgScore * 100) / 100,
        judgeCount: subScores.length
      };
    }).sort((a, b) => b.averageScore - a.averageScore);

    setLeaderboard(lb);
  }

  function handleStatusFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value as SubmissionStatus);
  }

  function openReviewModal(submission: SubmissionAdmin) {  
    setReviewSubmission(submission);
    setAdminComments(submission.adminComments || '');
  }

  function closeReviewModal() {
    setReviewSubmission(null);
    setAdminComments('');
  }

  function updateSubmissionStatus(status: SubmissionStatus) {
    if (!reviewSubmission) return;
    const submissions: SubmissionAdmin[] = JSON.parse(localStorage.getItem('submissions') || '[]');  
    const index = submissions.findIndex(s => s.id === reviewSubmission.id);
    if (index === -1) return;

    submissions[index].status = status;
    submissions[index].adminComments = adminComments;
    submissions[index].updatedAt = new Date().toISOString();

    localStorage.setItem('submissions', JSON.stringify(submissions));
    loadSubmissions();
    closeReviewModal();
    alert(`Submission ${status === 'approved' ? 'approved' : 'rejected'}.`);
  }

  function handleAnnouncementSubmit(title: string, content: string, date: string) {
    if (!title || !content || !date) {
      alert('Please fill all announcement fields.');
      return;
    }

    const data: Announcement[] = JSON.parse(localStorage.getItem('announcements') || '[]');
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title,
      content,
      date,
    };
    data.push(newAnnouncement);
    localStorage.setItem('announcements', JSON.stringify(data));
    loadAnnouncements();
    alert('Announcement created!');
  }

  function logout() {
    localStorage.removeItem('currentUser');
    window.location.replace('/?logout=true');
  }

  return (
    <>
      <Header user={currentUser} onLogout={logout} />
      <Tabs activeTab={activeTab} onChange={setActiveTab} />
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'submissions' && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Project Submissions</h2>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="px-3 py-1 rounded bg-slate-800 border border-slate-600 text-slate-100"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <SubmissionList submissions={submissions} onReviewClick={openReviewModal} />
          </section>
        )}
        {activeTab === 'judges' && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Manage Judges</h2>
            <JudgesList judges={judges} />
          </section>
        )}
        {activeTab === 'timeline' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Event Timeline & Announcements</h2>
            <AnnouncementsForm onSubmit={handleAnnouncementSubmit} />
            <AnnouncementsList announcements={announcements} />
          </section>
        )}
        {activeTab === 'leaderboard' && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">🏆 Live Leaderboard</h2>
            <Leaderboard leaderboard={leaderboard} />
          </section>
        )}
      </main>
      {reviewSubmission && (
        <ReviewModal
          submission={reviewSubmission}
          adminComments={adminComments}
          setAdminComments={setAdminComments}
          onClose={closeReviewModal}
          onUpdateStatus={updateSubmissionStatus}
        />
      )}
    </>
  );
}
