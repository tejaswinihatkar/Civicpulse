import { useState, useEffect } from 'react';
import { Trophy, Award, Shield, TrendingUp, Star, Crown, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getStoredUser, getLeaderboard } from '../../services/api';

const BADGE_DEFINITIONS = [
  { id: 'first-report', name: 'First Reporter', description: 'Submit your first issue report', icon: 'shield-check', requiredPoints: 10 },
  { id: 'active-citizen', name: 'Active Citizen', description: 'Report 5 issues', icon: 'trophy', requiredPoints: 50 },
  { id: 'community-hero', name: 'Community Hero', description: 'Get 10 issues resolved', icon: 'award', requiredPoints: 250 },
  { id: 'civic-champion', name: 'Civic Champion', description: 'Earn 500 points', icon: 'trophy', requiredPoints: 500 },
];

export function CitizenRewards() {
  const storedUser = getStoredUser();
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await getLeaderboard();
        setLeaderboardData(data || []);
      } catch (error) {
        console.error('Failed to load leaderboard', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const userPoints = storedUser?.points || 0;
  const userBadges = storedUser?.badges || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards & Achievements</h1>
          <p className="text-gray-600">Earn points, unlock badges, and climb the leaderboard</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Points Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-blue-100 mb-2">Your Total Points</p>
                  <div className="text-5xl font-bold">{userPoints}</div>
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-10 h-10" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                <div>
                  <div className="text-2xl font-bold">—</div>
                  <div className="text-sm text-blue-100">Issues Reported</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userBadges.length}</div>
                  <div className="text-sm text-blue-100">Badges Earned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userPoints >= 250 ? '10+' : '—'}</div>
                  <div className="text-sm text-blue-100">Issues Resolved</div>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Badges</h2>
                <span className="text-sm text-gray-600">{userBadges.length} / {BADGE_DEFINITIONS.length} unlocked</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {BADGE_DEFINITIONS.map((badge, index) => {
                  const isUnlocked = userBadges.includes(badge.id) || userPoints >= badge.requiredPoints;
                  const Icon = badge.icon === 'shield-check' ? Shield : badge.icon === 'trophy' ? Trophy : Award;

                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl border-2 ${
                        isUnlocked ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-blue-600' : 'bg-gray-400'}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                          <div className="text-xs text-gray-500">{badge.requiredPoints} points required</div>
                        </div>
                      </div>
                      {isUnlocked && <div className="mt-4 text-sm font-medium text-blue-600">✓ Unlocked</div>}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* How to Earn Points */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Earn Points</h2>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, title: 'Report an Issue', desc: 'Valid issue submission', pts: '+10 pts', color: 'green' },
                  { icon: Trophy, title: 'Issue Gets Resolved', desc: 'Your reported issue is fixed', pts: '+25 pts', color: 'blue' },
                  { icon: Star, title: 'Upvote Issues', desc: 'Support community issues', pts: '+5 pts', color: 'purple' },
                  { icon: Award, title: 'Verify Resolution', desc: 'Confirm issue is fixed', pts: '+20 pts', color: 'orange' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${item.color}-600 rounded-lg flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </div>
                    </div>
                    <div className={`text-${item.color}-600 font-bold`}>{item.pts}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Crown className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
              </div>
              <div className="space-y-4">
                {leaderboardData.slice(0, 10).map((user: any, index: number) => (
                  <motion.div
                    key={user.id || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-xl ${
                      user.id === storedUser?.id ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full overflow-hidden ${
                        index < 3 ? 'ring-2 ring-offset-2' : ''
                      } ${
                        index === 0 ? 'ring-yellow-400' : index === 1 ? 'ring-gray-400' : index === 2 ? 'ring-orange-400' : ''
                      }`}>
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' : index === 1 ? 'bg-gray-400 text-gray-900' : 'bg-orange-400 text-orange-900'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.points || 0} points</div>
                    </div>
                    {index >= 3 && <div className="text-gray-500 font-medium">#{index + 1}</div>}
                  </motion.div>
                ))}
                {leaderboardData.length === 0 && (
                  <div className="text-center py-6 text-slate-500">No leaderboard data yet. Start reporting!</div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">Keep reporting issues to climb the leaderboard!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
