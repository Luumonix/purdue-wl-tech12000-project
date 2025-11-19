'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { questionsAPI } from '@/lib/api';

interface Question {
  id: number;
  question_text: string;
  options: string[];
  category: string;
  difficulty: string;
  points_value: number;
}

interface AnswerResult {
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  points_earned: number;
  total_points: number;
}

export default function Game() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [totalPoints, setTotalPoints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadQuestions();
  }, [router]);

  const loadQuestions = async () => {
    try {
      const data = await questionsAPI.getRandomQuestions(5);
      setQuestions(data);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }

    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const resultData = await questionsAPI.submitAnswer(
        currentQuestion.id,
        selectedAnswer,
        timeTaken
      );
      setResult(resultData);
      setShowResult(true);
      setTotalPoints(resultData.total_points);
      if (resultData.is_correct) {
        setCorrectCount(correctCount + 1);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setResult(null);
      setStartTime(Date.now());
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading questions...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700 mb-4">No questions available</div>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🎮 Cybersecurity Challenge
          </h1>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{correctCount} correct</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Category and Difficulty */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentQuestion.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {currentQuestion.points_value} points
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQuestion.question_text}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'} ${
                  showResult && result?.correct_answer === option
                    ? 'border-green-500 bg-green-50'
                    : ''
                } ${
                  showResult && selectedAnswer === option && !result?.is_correct
                    ? 'border-red-500 bg-red-50'
                    : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!showResult && (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || submitting}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          )}
        </div>

        {/* Result Card */}
        {showResult && result && (
          <div className={`rounded-lg shadow-lg p-8 mb-6 ${
            result.is_correct ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
          }`}>
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">
                {result.is_correct ? '✅' : '❌'}
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {result.is_correct ? 'Correct!' : 'Incorrect'}
                </h3>
                <p className="text-lg">
                  {result.is_correct
                    ? `You earned ${result.points_earned} points!`
                    : 'Better luck next time!'}
                </p>
              </div>
            </div>

            {!result.is_correct && (
              <div className="mb-4">
                <p className="font-medium text-gray-700">
                  Correct answer: <span className="text-green-700">{result.correct_answer}</span>
                </p>
              </div>
            )}

            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-gray-900 mb-2">Explanation:</h4>
              <p className="text-gray-700">{result.explanation}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-lg font-medium">
                Total Points: <span className="text-blue-600">{result.total_points}</span>
              </div>
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Challenge'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
