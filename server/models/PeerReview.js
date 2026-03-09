const mongoose = require('mongoose');

const peerReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  },
  skillsRated: [{
    skillName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews (one user can review another user only once per project)
peerReviewSchema.index({ reviewer: 1, reviewedUser: 1, project: 1 }, { unique: true });

// Static method to calculate average rating for a user
peerReviewSchema.statics.getAverageRating = async function(userId) {
  const result = await this.aggregate([
    {
      $match: { reviewedUser: userId }
    },
    {
      $group: {
        _id: '$reviewedUser',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  if (result.length > 0) {
    // Update user's peer rating
    await mongoose.model('User').findByIdAndUpdate(userId, {
      'peerRating.average': result[0].averageRating,
      'peerRating.count': result[0].count
    });
    
    return {
      average: result[0].averageRating,
      count: result[0].count
    };
  }
  
  return { average: 0, count: 0 };
};

// Update user's rating after review is saved
peerReviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.reviewedUser);
});

// Update user's rating after review is deleted
peerReviewSchema.post('remove', async function() {
  await this.constructor.getAverageRating(this.reviewedUser);
});

module.exports = mongoose.model('PeerReview', peerReviewSchema);
