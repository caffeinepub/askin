import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { UserRole } from '../backend';
import { GraduationCap, Users } from 'lucide-react';

export default function RoleSetupModal() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && role) {
      saveProfile({ name: name.trim(), role });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            Welcome to Askin! 👋
          </DialogTitle>
          <DialogDescription className="text-base">
            Let's set up your profile. Choose your role to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="border-orange-200 focus:border-orange-400 dark:border-orange-800"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">I am a...</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole(UserRole.Junior)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === UserRole.Junior
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                }`}
              >
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Junior</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ask doubts</div>
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.Senior)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === UserRole.Senior
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                }`}
              >
                <Users className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Senior</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Answer doubts</div>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!name.trim() || !role || isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          >
            {isPending ? 'Setting up...' : 'Get Started'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
