import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { usePostAnswer } from '../hooks/usePostAnswer';
import { ExternalBlob } from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { FileText, Video, X } from 'lucide-react';
import { Progress } from './ui/progress';

interface AnswerFormProps {
  doubtId: Principal;
}

export default function AnswerForm({ doubtId }: AnswerFormProps) {
  const [text, setText] = useState('');
  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { mutate: postAnswer, isPending } = usePostAnswer();

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNotesFile(file);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    let notes: ExternalBlob | null = null;
    let video: ExternalBlob | null = null;

    if (notesFile) {
      const arrayBuffer = await notesFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      notes = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage / 2);
      });
    }

    if (videoFile) {
      const arrayBuffer = await videoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      video = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(50 + percentage / 2);
      });
    }

    postAnswer(
      { doubtId, text: text.trim(), notes, video },
      {
        onSuccess: () => {
          setText('');
          setNotesFile(null);
          setVideoFile(null);
          setUploadProgress(0);
        },
      }
    );
  };

  return (
    <Card className="border-green-200 dark:border-green-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardTitle className="text-xl text-green-800 dark:text-green-300">Post Your Answer</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium">
              Your Explanation
            </Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Provide a detailed explanation to help the student..."
              rows={4}
              required
              className="border-green-200 focus:border-green-400 dark:border-green-800 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Attach Notes (Optional)</Label>
              {notesFile ? (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{notesFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setNotesFile(null)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                  <FileText className="w-6 h-6 mb-1 text-green-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Upload notes</span>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleNotesChange} />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Attach Video (Optional)</Label>
              {videoFile ? (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{videoFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setVideoFile(null)}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                  <Video className="w-6 h-6 mb-1 text-green-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Upload video</span>
                  <input type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
                </label>
              )}
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button
            type="submit"
            disabled={!text.trim() || isPending}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            {isPending ? 'Posting...' : 'Post Answer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
