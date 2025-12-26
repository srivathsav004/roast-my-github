
import { GitHubUserData, RepoInfo } from '../types';

export const fetchGitHubData = async (username: string): Promise<GitHubUserData> => {
  const baseUrl = 'https://api.github.com';
  
  // Basic Fetch for user
  const userRes = await fetch(`${baseUrl}/users/${username}`);
  if (!userRes.ok) throw new Error(userRes.status === 404 ? 'User not found' : 'GitHub API Error');
  const user = await userRes.json();

  // Fetch repos (up to 100)
  const reposRes = await fetch(`${baseUrl}/users/${username}/repos?per_page=100&sort=pushed`);
  const repos = await reposRes.json();

  // Fetch events for commit patterns (Public events)
  const eventsRes = await fetch(`${baseUrl}/users/${username}/events/public`);
  const events = await eventsRes.json();

  // Calculate totals
  const totalStars = repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc: number, r: any) => acc + (r.forks_count || 0), 0);
  
  // Language breakdown
  const langStats: Record<string, number> = {};
  repos.forEach((r: any) => {
    if (r.language) {
      langStats[r.language] = (langStats[r.language] || 0) + 1;
    }
  });

  const topLanguage = Object.keys(langStats).sort((a, b) => langStats[b] - langStats[a])[0] || 'Unknown';

  // Process top repos
  const topRepos: RepoInfo[] = repos
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r: any) => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language || 'Plain Text',
      url: r.html_url,
      pushedAt: r.pushed_at
    }));

  // Commit patterns
  const pushEvents = events.filter((e: any) => e.type === 'PushEvent');
  const commitMessages = pushEvents.flatMap((e: any) => (e.payload.commits || []).map((c: any) => c.message)).slice(0, 10);
  const commitHours = pushEvents.map((e: any) => new Date(e.created_at).getHours());
  
  // Calculate 24h distribution
  const commitHoursDistribution = new Array(24).fill(0);
  commitHours.forEach(h => commitHoursDistribution[h]++);

  const peakHour = commitHours.length > 0 
    ? commitHours.reduce((acc: any, curr: any, i: number, arr: any[]) => 
        (arr.filter(v => v === acc).length >= arr.filter(v => v === curr).length ? acc : curr), commitHours[0])
    : 12;

  const accountAgeYears = new Date().getFullYear() - new Date(user.created_at).getFullYear();

  return {
    username: user.login,
    name: user.name || user.login,
    bio: user.bio,
    avatarUrl: user.avatar_url,
    repoCount: user.public_repos,
    totalStars,
    totalForks,
    followers: user.followers,
    following: user.following,
    accountAgeYears,
    createdAt: user.created_at,
    location: user.location,
    blog: user.blog,
    publicRepos: user.public_repos,
    languages: langStats,
    topLanguage,
    topRepos,
    recentCommitMessages: commitMessages,
    peakHour,
    commitHoursDistribution,
    totalContributionsYear: pushEvents.length * 5 // Rough estimate for display
  };
};
