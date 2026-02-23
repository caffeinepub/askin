import React, { useState } from 'react';
import { usePostAnswer } from '../hooks/usePostAnswer';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';
import { Upload, FileText, Video } from 'lucide-react';
import { Progress } from './ui/progress';

interface AnswerFormProps {
  doubtId: Principal;
}

export default function AnswerForm({ doubtId }: AnswerFormProps) {
  const [text, setText] = useState('');
  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [notesProgress, setNotesProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const postAnswer = usePostAnswer();

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type for notes (documents)
      const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid document file (PDF, TXT, DOC, DOCX)');
        e.target.value = '';
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      setNotesFile(file);
      setNotesProgress(0);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type for video
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid video file (MP4, WebM, OGG, MOV)');
        e.target.value = '';
        return;
      }
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video size must be less than 50MB');
        e.target.value = '';
        return;
      }
      setVideoFile(file);
      setVideoProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      alert('Please provide an explanation');
      return;
    }

    try {
      let notesBlob: ExternalBlob | null = null;
      let videoBlob: ExternalBlob | null = null;

      if (notesFile) {
        const notesBytes = new Uint8Array(await notesFile.arrayBuffer());
        notesBlob = ExternalBlob.fromBytes(notesBytes).withUploadProgress((percentage) => {
          setNotesProgress(percentage);
        });
      }

      if (videoFile) {
        const videoBytes = new Uint8Array(await videoFile.arrayBuffer());
        videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress((percentage) => {
          setVideoProgress(percentage);
        });
      }

      await postAnswer.mutateAsync({
        doubtId,
        text,
        notes: notesBlob,
        video: videoBlob,
      });

      // Reset form
      setText('');
      setNotesFile(null);
      setVideoFile(null);
      setNotesProgress(0);
      setVideoProgress(0);
      
      // Clear file inputs
      const notesInput = document.getElementById('notes-upload') as HTMLInputElement;
      const videoInput = document.getElementById('video-upload') as HTMLInputElement;
      if (notesInput) notesInput.value = '';
      if (videoInput) videoInput.value = '';
    } catch (error) {
      console.error('Failed to post answer:', error);
      alert('Failed to post answer. Please try again.');
    }
  };

  const isUploading = notesProgress > 0 && notesProgress < 100 || videoProgress > 0 && videoProgress < 100;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl">Post Your Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="answer-text" className="text-base font-medium">
              Explanation *
            </Label>
            <Textarea
              id="answer-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Provide a detailed explanation to help the student..."
              className="min-h-[150px] mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes-upload" className="text-base font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes (Optional)
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Upload supporting documents (PDF, TXT, DOC, DOCX - max 10MB)
            </p>
            <Input
              id="notes-upload"
              type="file"
              onChange={handleNotesChange}
              accept=".pdf,.txt,.doc,.docx"
              className="cursor-pointer"
            />
            {notesFile && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Selected: {notesFile.name}
                </p>
                {notesProgress > 0 && notesProgress < 100 && (
                  <div className="mt-2">
                    <Progress value={notesProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading notes: {notesProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="video-upload" className="text-base font-medium flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video Explanation (Optional)
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Upload a video explanation (MP4, WebM, OGG, MOV - max 50MB)
            </p>
            <Input
              id="video-upload"
              type="file"
              onChange={handleVideoChange}
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              className="cursor-pointer"
            />
            {videoFile && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Selected: {videoFile.name}
                </p>
                {videoProgress > 0 && videoProgress < 100 && (
                  <div className="mt-2">
                    <Progress value={videoProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading video: {videoProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={postAnswer.isPending || isUploading || !text.trim()}
            className="w-full"
          >
            {postAnswer.isPending ? (
              'Posting Answer...'
            ) : isUploading ? (
              'Uploading Files...'
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Post Answer
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
