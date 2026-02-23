import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { MessageCircle, Users, Trophy, BookOpen, LogIn } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* Logo and Brand */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Welcome to Askin
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              A collaborative learning platform where juniors ask questions and seniors share their knowledge
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ask Doubts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Juniors can post questions with images and get help from experienced seniors
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Share Knowledge</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seniors provide detailed answers with notes and videos to help others learn
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Earn Recognition</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get rated for your answers and climb the leaderboard to showcase your expertise
              </p>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-8">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Get Started
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Secure authentication powered by Internet Identity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
