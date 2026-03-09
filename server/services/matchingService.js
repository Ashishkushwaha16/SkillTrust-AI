/**
 * Calculate cosine similarity between two skill sets
 * Used to find users with similar skills
 */
exports.calculateCosineSimilarity = (skills1, skills2) => {
  if (!skills1.length || !skills2.length) {
    return 0;
  }

  // Create a map of all unique skill names
  const allSkills = new Set([
    ...skills1.map(s => s.name.toLowerCase()),
    ...skills2.map(s => s.name.toLowerCase())
  ]);

  // Create vectors for both skill sets
  const vector1 = [];
  const vector2 = [];

  allSkills.forEach(skillName => {
    const skill1 = skills1.find(s => s.name.toLowerCase() === skillName);
    const skill2 = skills2.find(s => s.name.toLowerCase() === skillName);

    vector1.push(skill1 ? skill1.level : 0);
    vector2.push(skill2 ? skill2.level : 0);
  });

  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
  }

  // Calculate magnitudes
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  // Calculate cosine similarity
  const similarity = dotProduct / (magnitude1 * magnitude2);

  return Math.round(similarity * 100); // Return as percentage
};

/**
 * Calculate complementary score between two skill sets
 * Higher score means users have different but complementary skills
 */
exports.calculateComplementaryScore = (skills1, skills2) => {
  if (!skills1.length || !skills2.length) {
    return 0;
  }

  const skillNames1 = new Set(skills1.map(s => s.name.toLowerCase()));
  const skillNames2 = new Set(skills2.map(s => s.name.toLowerCase()));

  // Find unique skills in each set
  const uniqueInSet1 = [...skillNames1].filter(s => !skillNames2.has(s));
  const uniqueInSet2 = [...skillNames2].filter(s => !skillNames1.has(s));

  // Calculate complementary score based on unique skills
  const totalUniqueSkills = uniqueInSet1.length + uniqueInSet2.length;
  const totalSkills = skillNames1.size + skillNames2.size;

  // Return percentage of unique skills
  return Math.round((totalUniqueSkills / totalSkills) * 100);
};

/**
 * Find matching users based on similar skills
 */
exports.findMatches = (currentUser, allUsers) => {
  return allUsers.map(user => {
    const similarityScore = this.calculateCosineSimilarity(
      currentUser.skills,
      user.skills
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        githubUsername: user.githubUsername,
        trustScore: user.trustScore,
        skills: user.skills
      },
      similarityScore,
      matchReason: 'Similar skills'
    };
  });
};

/**
 * Find users with complementary skills
 */
exports.findComplementaryMatches = (currentUser, allUsers) => {
  return allUsers.map(user => {
    const complementaryScore = this.calculateComplementaryScore(
      currentUser.skills,
      user.skills
    );

    // Get unique skills from the other user
    const currentSkillNames = new Set(
      currentUser.skills.map(s => s.name.toLowerCase())
    );
    const complementarySkills = user.skills
      .filter(s => !currentSkillNames.has(s.name.toLowerCase()))
      .slice(0, 5); // Top 5 complementary skills

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        githubUsername: user.githubUsername,
        trustScore: user.trustScore,
        skills: user.skills
      },
      complementaryScore,
      complementarySkills: complementarySkills.map(s => s.name),
      matchReason: 'Complementary skills'
    };
  });
};

/**
 * Calculate Jaccard similarity coefficient
 * Alternative similarity measure
 */
exports.calculateJaccardSimilarity = (skills1, skills2) => {
  const skillNames1 = new Set(skills1.map(s => s.name.toLowerCase()));
  const skillNames2 = new Set(skills2.map(s => s.name.toLowerCase()));

  const intersection = new Set(
    [...skillNames1].filter(s => skillNames2.has(s))
  );

  const union = new Set([...skillNames1, ...skillNames2]);

  if (union.size === 0) {
    return 0;
  }

  return Math.round((intersection.size / union.size) * 100);
};
