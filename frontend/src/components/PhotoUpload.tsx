import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { ExternalBlob } from '../backend';

interface PhotoUploadProps {
  photos: ExternalBlob[];
  onPhotosChange: (photos: ExternalBlob[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({ photos, onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    try {
      const newBlobs = await Promise.all(
        files.slice(0, maxPhotos - photos.length).map(async (file) => {
          const buffer = await file.arrayBuffer();
          return ExternalBlob.fromBytes(new Uint8Array(buffer));
        })
      );
      onPhotosChange([...photos, ...newBlobs]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-muted">
            <img
              src={photo.getDirectURL()}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 w-5 h-5 rounded-md bg-foreground/60 flex items-center justify-center text-white hover:bg-foreground/80 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-muted/80 transition-all disabled:opacity-60"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span className="text-[10px] font-body font-medium">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-xs font-body text-muted-foreground mt-2">
        {photos.length}/{maxPhotos} photos added
      </p>
    </div>
  );
}
