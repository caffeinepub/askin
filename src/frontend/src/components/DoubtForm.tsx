import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { usePostDoubt } from '../hooks/usePostDoubt';
import { ExternalBlob } from '../backend';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Progress } from './ui/progress';

export default function DoubtForm() {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { mutate: postDoubt, isPending } = usePostDoubt();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    let attachment: ExternalBlob | null = null;
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      attachment = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
    }

    postDoubt(
      { description: description.trim(), attachment },
      {
        onSuccess: () => {
          setDescription('');
          setImageFile(null);
          setImagePreview(null);
          setUploadProgress(0);
        },
      }
    );
  };

  return (
    <Card className="border-orange-200 dark:border-orange-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
        <CardTitle className="text-xl text-orange-800 dark:text-orange-300">Post Your Doubt</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Describe your doubt
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you need help with? Be as detailed as possible..."
              rows={4}
              required
              className="border-orange-200 focus:border-orange-400 dark:border-orange-800 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Attach Image (Optional)</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-orange-200 dark:border-orange-800"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={removeImage}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-lg cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-2 text-orange-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <Button
            type="submit"
            disabled={!description.trim() || isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          >
            {isPending ? 'Posting...' : 'Post Doubt'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
