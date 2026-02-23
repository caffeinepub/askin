import { Link } from '@tanstack/react-router';
import { MessageCircle, Trophy, Heart } from 'lucide-react';
import LoginButton from './LoginButton';
import RoleSetupModal from './RoleSetupModal';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-orange-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Askin
                </span>
              </Link>
              {userProfile && (
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    to="/"
                    className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors"
                  >
                    Doubts
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors flex items-center space-x-1"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Leaderboard</span>
                  </Link>
                </nav>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {userProfile && (
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    {userProfile.name}
                  </span>
                  <span className="text-xs px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full">
                    {userProfile.role === 'Junior' ? '👨‍🎓 Junior' : '👨‍🏫 Senior'}
                  </span>
                </div>
              )}
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-t border-orange-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Askin. Empowering students to learn together.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {showProfileSetup && <RoleSetupModal />}
    </div>
  );
}
