import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '@clerk/clerk-react';

const LeaderBoard = () => {
  const { user } = useApp();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [userInTop10, setUserInTop10] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await getToken()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/getLeaderboard`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}` // Add header
          }
        });
        const data = await res.json();
        if (res.ok && data.data) {
          setLeaderboard(data.data.topUsers);
          setUserRank(data.data.userRank);
          setUserScore(data.data.userScore);
          setUserInTop10(data.data.userInTop10);
        } else {
          setError(data.message || 'Failed to fetch leaderboard');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆 Civic Leaderboard</h1>
          <p className="text-gray-600">See how you rank among community contributors</p>
        </div>

        {/* User's Rank Card */}
        {user && (
          <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-8 shadow-lg ${
            userInTop10 ? 'ring-2 ring-yellow-400' : ''
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Your Rank</h2>
                <p className="text-blue-100">
                  {userInTop10 ? 'Congratulations! You\'re in the top 10!' : 'Keep contributing to climb the ranks!'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  #{userRank}
                </div>
                <div className="text-sm text-blue-100">
                  Civic Score: {userScore}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Top 10 Contributors</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {leaderboard.map((u, index) => (
              <div 
                key={u._id} 
                className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${
                  u._id === user?._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {u.email || `User ${u._id.slice(-6)}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {u._id.slice(-8)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {u.civicSenseScore || 0}
                  </div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
          
          {leaderboard.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No leaderboard data available yet.</p>
              <p className="text-sm mt-2">Be the first to contribute!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;