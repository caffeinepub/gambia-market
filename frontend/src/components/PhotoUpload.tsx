import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { Progress } from './ui/progress';

interface PhotoUploadProps {
  photos: ExternalBlob[];
  onChange: (photos: ExternalBlob[]) => void;
  maxPhotos?: number;
}

interface PhotoPreview {
  blob: ExternalBlob;
  previewUrl: string;
  progress: number;
}

export default function PhotoUpload({ photos, onChange, maxPhotos = 5 }: PhotoUploadProps) {
  const [previews, setPreviews] = useState<PhotoPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = maxPhotos - photos.length;
    const toProcess = files.slice(0, remaining);

    const newPreviews: PhotoPreview[] = [];
    const newBlobs: ExternalBlob[] = [];

    for (const file of toProcess) {
      const previewUrl = URL.createObjectURL(file);
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      const preview: PhotoPreview = { blob: ExternalBlob.fromBytes(uint8), previewUrl, progress: 0 };
      newPreviews.push(preview);
      newBlobs.push(preview.blob);
    }

    setPreviews((prev) => [...prev, ...newPreviews]);
    onChange([...photos, ...newBlobs]);

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newPhotos = photos.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newPhotos);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
            <img src={preview.previewUrl} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            {preview.progress > 0 && preview.progress < 100 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Progress value={preview.progress} className="w-12 h-1" />
              </div>
            )}
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center"
              aria-label="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-body">Add Photo</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload photos"
      />

      <p className="text-xs text-muted-foreground font-body">
        {photos.length}/{maxPhotos} photos added
      </p>
    </div>
  );
}
