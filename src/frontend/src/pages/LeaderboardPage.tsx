import LeaderboardTable from '../components/LeaderboardTable';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 mb-4">
          <img
            src="/assets/generated/trophy-icon.dim_128x128.png"
            alt="Trophy"
            className="w-12 h-12"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Top seniors ranked by their contributions. Answer doubts and earn points to climb the ranks!
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-6 mb-6 border border-orange-200 dark:border-orange-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">How Points Work</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-orange-600 dark:text-orange-400 font-bold">+5</span>
              <span>points for posting an answer</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-600 dark:text-orange-400 font-bold">+1-5</span>
              <span>bonus points based on the rating you receive (1-5 stars)</span>
            </li>
          </ul>
        </div>

        <LeaderboardTable />
      </div>
    </div>
  );
}
