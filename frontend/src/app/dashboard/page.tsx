'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI, leaderboardAPI } from '@/lib/api';

interface UserProfile {
  username: string;
  total_points: number;
  rank: number;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  total_points: number;
  accuracy: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [profileData, leaderboardData] = await Promise.all([
        authAPI.getProfile(),
        leaderboardAPI.getLeaderboard(10)
      ]);
      setProfile(profileData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading data:', error);
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            🛡️ CyberGuard Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {profile?.username}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to improve your cybersecurity skills?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-blue-600">
              {profile?.total_points || 0}
            </div>
            <div className="text-gray-600">Total Points</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-green-600">
              #{profile?.rank || 0}
            </div>
            <div className="text-gray-600">Your Rank</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-purple-600">
              {profile?.correct_attempts || 0}/{profile?.total_attempts || 0}
            </div>
            <div className="text-gray-600">Correct Answers</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-orange-600">
              {profile?.accuracy.toFixed(1) || 0}%
            </div>
            <div className="text-gray-600">Accuracy</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/game"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-lg p-8 text-center transition-all transform hover:scale-105"
          >
            <div className="text-5xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-2">Start Challenge</h3>
            <p className="text-blue-100">
              Answer 5 random cybersecurity questions
            </p>
          </Link>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-2">Categories</h3>
            <div className="text-purple-100 space-y-1">
              <div>🎣 Phishing</div>
              <div>🔐 Passwords</div>
              <div>📡 WiFi Security</div>
              <div>🔑 Multi-Factor Auth</div>
              <div>🛡️ General Security</div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Username</th>
                  <th className="text-left py-3 px-4">Points</th>
                  <th className="text-left py-3 px-4">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`border-b border-gray-100 ${
                      entry.username === profile?.username
                        ? 'bg-blue-50 font-bold'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      {entry.rank === 1 && '🥇'}
                      {entry.rank === 2 && '🥈'}
                      {entry.rank === 3 && '🥉'}
                      {entry.rank > 3 && `#${entry.rank}`}
                    </td>
                    <td className="py-3 px-4">{entry.username}</td>
                    <td className="py-3 px-4">{entry.total_points}</td>
                    <td className="py-3 px-4">{entry.accuracy.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
