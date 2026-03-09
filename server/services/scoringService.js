/**
 * Calculate user's trust score based on multiple factors
 * 
 * Scoring Algorithm:
 * - GitHub Activity (40% weight): Based on commits, repos, followers
 * - Project Count (30% weight): Number and quality of verified projects
 * - Peer Rating (30% weight): Average rating from peer reviews
 */
exports.calculateTrustScore = (user) => {
  let score = 0;

  // 1. GitHub Activity Score (40%)
  const githubScore = this.calculateGithubScore(user.githubData);
  score += githubScore * 0.4;

  // 2. Project Score (30%)
  const projectScore = this.calculateProjectScore(user.projects);
  score += projectScore * 0.3;

  // 3. Peer Rating Score (30%)
  const peerScore = this.calculatePeerScore(user.peerRating);
  score += peerScore * 0.3;

  return Math.round(score);
};

/**
 * Calculate GitHub activity score (0-100)
 */
exports.calculateGithubScore = (githubData) => {
  if (!githubData) return 0;

  let score = 0;

  // Commits (50% of GitHub score)
  const commitScore = Math.min((githubData.totalCommits / 200) * 50, 50);

  // Repositories (30% of GitHub score)
  const repoScore = Math.min((githubData.totalRepos / 50) * 30, 30);

  // Followers (20% of GitHub score)
  const followerScore = Math.min((githubData.followers / 100) * 20, 20);

  score = commitScore + repoScore + followerScore;

  return Math.round(score);
};

/**
 * Calculate project score (0-100)
 */
exports.calculateProjectScore = (projects) => {
  if (!projects || projects.length === 0) return 0;

  // Base score on project count
  const countScore = Math.min((projects.length / 20) * 50, 50);

  // Average verification score of projects
  const totalVerificationScore = projects.reduce(
    (sum, project) => sum + (project.verificationScore || 0),
    0
  );
  const avgVerificationScore = totalVerificationScore / projects.length;

  // Verified projects bonus
  const verifiedCount = projects.filter(p => p.verified).length;
  const verifiedBonus = Math.min((verifiedCount / projects.length) * 20, 20);

  const score = (avgVerificationScore * 0.5) + countScore + verifiedBonus;

  return Math.round(score);
};

/**
 * Calculate peer rating score (0-100)
 */
exports.calculatePeerScore = (peerRating) => {
  if (!peerRating || !peerRating.count) return 0;

  // Convert 5-star rating to 100-point scale
  const ratingScore = (peerRating.average / 5) * 100;

  // Confidence factor based on number of reviews
  let confidenceFactor = 1;
  if (peerRating.count < 5) {
    confidenceFactor = peerRating.count / 5;
  }

  return Math.round(ratingScore * confidenceFactor);
};

/**
 * Calculate skill level based on various factors
 */
exports.calculateSkillLevel = (skillData) => {
  let level = 0;

  // Repository usage (40%)
  if (skillData.repoCount) {
    level += Math.min((skillData.repoCount / 10) * 40, 40);
  }

  // Commit frequency (30%)
  if (skillData.commits) {
    level += Math.min((skillData.commits / 50) * 30, 30);
  }

  // Peer verification (30%)
  if (skillData.peerVerifications) {
    level += Math.min((skillData.peerVerifications / 5) * 30, 30);
  }

  return Math.round(level);
};

/**
 * Calculate project verification score
 */
exports.calculateProjectVerificationScore = (projectData) => {
  let score = 0;

  // Commit count (30%)
  const commitScore = Math.min((projectData.commits / 100) * 30, 30);

  // Stars (25%)
  const starScore = Math.min((projectData.stars / 50) * 25, 25);

  // Forks (20%)
  const forkScore = Math.min((projectData.forks / 20) * 20, 20);

  // Contributors (15%)
  const contributorScore = Math.min(
    (projectData.contributors / 10) * 15,
    15
  );

  // Documentation (10%)
  const docScore = projectData.hasReadme ? 10 : 0;

  score = commitScore + starScore + forkScore + contributorScore + docScore;

  return Math.round(score);
};

/**
 * Check if project should be verified automatically
 */
exports.shouldAutoVerify = (verificationScore) => {
  return verificationScore >= 70;
};

/**
 * Get trust score category
 */
exports.getTrustScoreCategory = (score) => {
  if (score >= 80) return 'Expert';
  if (score >= 60) return 'Advanced';
  if (score >= 40) return 'Intermediate';
  if (score >= 20) return 'Beginner';
  return 'Newcomer';
};
