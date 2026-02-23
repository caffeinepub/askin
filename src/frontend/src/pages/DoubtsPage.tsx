import DoubtsFeed from '../components/DoubtsFeed';
import DoubtForm from '../components/DoubtForm';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { UserRole } from '../backend';
import { Skeleton } from '../components/ui/skeleton';

export default function DoubtsPage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  const isJunior = userProfile?.role === UserRole.Junior;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Askin 👋
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            A platform where juniors ask doubts and seniors share knowledge. Learn together, grow together!
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👨‍🎓</span>
              <span>Post doubts with photos</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👨‍🏫</span>
              <span>Answer with notes & videos</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span>Rate helpful answers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <span>Earn points & climb leaderboard</span>
            </div>
          </div>
        </div>
        <img
          src="/assets/generated/hero-students.dim_1200x600.png"
          alt="Students learning together"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recent Doubts</h2>
            <DoubtsFeed />
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-lg" />
          ) : isJunior ? (
            <DoubtForm />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-800 p-6 text-center">
              <img
                src="/assets/generated/doubt-icon.dim_128x128.png"
                alt="Doubt"
                className="w-16 h-16 mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-600 dark:text-gray-400">
                As a Senior, you can answer doubts posted by Juniors. Click on any doubt to provide your expertise!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
