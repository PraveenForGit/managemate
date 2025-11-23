type SubmissionStatus = 'all' | 'pending' | 'approved' | 'rejected';
export interface Team {
  id: string;
  name: string;
  members: string[]; // user IDs
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'participant' | 'admin' | 'judge';
}

export interface Submission {
  updatedAt: string;
  id: string;
  projectTitle: string;
  problemStatement: string;
  githubLink: string;
  deploymentLink?: string;
  demoVideo?: string;
  readme: string;
  buildLogs?: string;
  adminComments?: string;
  status: string;
  createdAt: string;
  teamId: string;
  userId: string;
}

export interface MentorRequest {
  id: string;
  teamId: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface LeaderboardItem {
  submission: Submission;
  team?: Team;
  averageScore: number;
  judgeCount: number;
}

export interface SubmissionAdmin {
  updatedAt: string;
  id: string;
  projectTitle: string;
  problemStatement: string;
  status: SubmissionStatus;
  teamId: string;
  userId: string;
  githubLink: string;
  deploymentLink?: string;
  demoVideo?: string;
  readme: string;
  buildLogs?: string;
  adminComments?: string;
  createdAt: string;
}



export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Score {
  id: string;
  submissionId: string;
  judgeId: string;
  scores: {
    innovation: number;
    uiux: number;
    impact: number;
    technical: number;
    completion: number;
  };
  total: number;
  comments?: string;
}
