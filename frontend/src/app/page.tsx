'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🛡️ CyberGuard
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            Gamified Cybersecurity Training
          </p>
          <p className="text-lg text-gray-600">
            Learn to protect yourself from cyber threats while earning points!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Answer real-world cybersecurity questions based on actual Purdue scenarios
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Earn Points</h3>
            <p className="text-gray-600">
              Compete with peers and climb the leaderboard as you master security concepts
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your improvement across different security categories
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Register
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Why CyberGuard?</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Based on Research:</strong> Our questions are derived from actual observations 
              of Purdue students and address real vulnerabilities found on campus.
            </p>
            <p>
              <strong>Practical Knowledge:</strong> Learn about phishing, password security, 
              public WiFi risks, multi-factor authentication, and more.
            </p>
            <p>
              <strong>Immediate Feedback:</strong> Get instant explanations for every question, 
              helping you understand not just what's correct, but why.
            </p>
            <p>
              <strong>Engaging Format:</strong> Short, focused questions that fit into your busy 
              schedule - complete challenges in just 5-10 minutes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600">
          <p>Developed for Purdue University students</p>
          <p className="text-sm mt-2">TECH 120 Final Project - Fall 2025</p>
        </div>
      </div>
    </main>
  );
}
