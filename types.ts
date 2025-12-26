
export interface GitHubUserData {
  username: string;
  name: string;
  bio: string | null;
  avatarUrl: string;
  repoCount: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  accountAgeYears: number;
  createdAt: string;
  location: string | null;
  blog: string | null;
  publicRepos: number;
  languages: Record<string, number>;
  topLanguage: string;
  topRepos: RepoInfo[];
  recentCommitMessages: string[];
  peakHour: number;
  commitHoursDistribution: number[];
  totalContributionsYear: number;
}

export interface RepoInfo {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string;
  url: string;
  pushedAt: string;
}

export interface RoastData {
  overviewRoast: string;
  repoRoasts: Array<{ repo: string; roast: string }>;
  languageRoast: string;
  commitRoast: string;
  socialRoast: string;
  bestOneLiners: string[];
  diversityScore: number;
  consistencyScore: number;
  effortScore: number;
}

export enum AppState {
  LANDING = 'LANDING',
  LOADING = 'LOADING',
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR'
}
