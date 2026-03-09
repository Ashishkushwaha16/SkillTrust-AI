const axios = require('axios');

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
  }
});

/**
 * Get user's GitHub profile
 */
exports.getUserProfile = async (username) => {
  try {
    const response = await axiosInstance.get(`/users/${username}`);
    return {
      name: response.data.name,
      login: response.data.login,
      avatar: response.data.avatar_url,
      bio: response.data.bio,
      location: response.data.location,
      publicRepos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      createdAt: response.data.created_at,
      url: response.data.html_url
    };
  } catch (error) {
    throw new Error(`Failed to fetch GitHub profile: ${error.message}`);
  }
};

/**
 * Get user's repositories
 */
exports.getRepositories = async (username) => {
  try {
    const response = await axiosInstance.get(`/users/${username}/repos`, {
      params: {
        sort: 'updated',
        per_page: 100
      }
    });

    return response.data.map(repo => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
      createdAt: repo.created_at,
      topics: repo.topics
    }));
  } catch (error) {
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
};

/**
 * Get repository data (stars, forks, commits)
 */
exports.getRepositoryData = async (repoUrl) => {
  try {
    // Extract owner and repo name from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }

    const [, owner, repo] = match;

    // Get repository details
    const repoResponse = await axiosInstance.get(`/repos/${owner}/${repo}`);

    // Get commit count (approximate)
    const commitsResponse = await axiosInstance.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: 1 }
    });

    const commitCount = commitsResponse.headers.link
      ? parseInt(commitsResponse.headers.link.match(/page=(\d+)>; rel="last"/)?.[1] || 1)
      : 1;

    return {
      stars: repoResponse.data.stargazers_count,
      forks: repoResponse.data.forks_count,
      language: repoResponse.data.language,
      commits: commitCount
    };
  } catch (error) {
    throw new Error(`Failed to fetch repository data: ${error.message}`);
  }
};

/**
 * Get user statistics
 */
exports.getUserStats = async (username) => {
  try {
    const [profileData, reposData] = await Promise.all([
      this.getUserProfile(username),
      this.getRepositories(username)
    ]);

    // Calculate total commits (approximate from all repos)
    let totalCommits = 0;
    for (const repo of reposData.slice(0, 10)) { // Limit to 10 repos to avoid rate limits
      try {
        const commitsResponse = await axiosInstance.get(
          `/repos/${repo.fullName}/commits`,
          { params: { author: username, per_page: 100 } }
        );
        totalCommits += commitsResponse.data.length;
      } catch (err) {
        // Skip if error (private repo, etc.)
        continue;
      }
    }

    return {
      totalCommits,
      totalRepos: profileData.publicRepos,
      followers: profileData.followers,
      publicGists: 0 // Can be enhanced
    };
  } catch (error) {
    throw new Error(`Failed to fetch user stats: ${error.message}`);
  }
};

/**
 * Get user's contribution activity
 */
exports.getContributions = async (username) => {
  try {
    const response = await axiosInstance.get(`/users/${username}/events/public`, {
      params: { per_page: 100 }
    });

    const contributions = {
      pushEvents: 0,
      pullRequests: 0,
      issues: 0,
      reviews: 0
    };

    response.data.forEach(event => {
      switch (event.type) {
        case 'PushEvent':
          contributions.pushEvents++;
          break;
        case 'PullRequestEvent':
          contributions.pullRequests++;
          break;
        case 'IssuesEvent':
          contributions.issues++;
          break;
        case 'PullRequestReviewEvent':
          contributions.reviews++;
          break;
      }
    });

    return contributions;
  } catch (error) {
    throw new Error(`Failed to fetch contributions: ${error.message}`);
  }
};

/**
 * Extract skills from repositories based on languages
 */
exports.extractSkillsFromRepos = async (username) => {
  try {
    const repos = await this.getRepositories(username);

    // Count language occurrences
    const languageCounts = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    // Convert to skills array with levels based on frequency
    const totalRepos = repos.length;
    const skills = Object.entries(languageCounts).map(([language, count]) => ({
      name: language,
      level: Math.min(Math.round((count / totalRepos) * 100), 100),
      verified: count >= 3 // Verified if used in 3+ repos
    }));

    return skills.sort((a, b) => b.level - a.level);
  } catch (error) {
    throw new Error(`Failed to extract skills: ${error.message}`);
  }
};

/**
 * Get language statistics
 */
exports.getLanguageStats = async (username) => {
  try {
    const repos = await this.getRepositories(username);

    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return Object.entries(languages)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    throw new Error(`Failed to fetch language stats: ${error.message}`);
  }
};
