import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import AuthGuard from '../components/AuthGuard';
import PhotoUpload from '../components/PhotoUpload';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useCreateListing, useCategories } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { ListingId, ExternalBlob } from '../backend';

const DEFAULT_CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Vehicles', 'Services', 'Furniture', 'Agriculture', 'Other'];
const CONDITIONS = ['New', 'Used', 'Refurbished'];

interface CreateListingProps {
  onSuccess: (id: ListingId) => void;
  onCancel: () => void;
}

function CreateListingForm({ onSuccess, onCancel }: CreateListingProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<ExternalBlob[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories } = useCategories();
  const createListing = useCreateListing();
  const allCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!category) newErrors.category = 'Category is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Valid price is required';
    if (!condition) newErrors.condition = 'Condition is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const listingId = await createListing.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category,
        price: BigInt(Math.round(Number(price))),
        condition,
        photos,
        location: location.trim(),
      });
      toast.success('Listing created successfully! 🎉');
      onSuccess(listingId);
    } catch {
      toast.error('Failed to create listing. Please try again.');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-14 bg-card z-10">
        <button onClick={onCancel} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body font-medium text-sm">Cancel</span>
        </button>
        <h1 className="font-heading font-bold text-base text-foreground">Create Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-5">
        {/* Photos */}
        <div className="flex flex-col gap-2">
          <Label className="font-body font-medium">Photos (up to 5)</Label>
          <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={5} />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" className="font-body font-medium">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you selling?"
            className={`h-12 text-base ${errors.title ? 'border-destructive' : ''}`}
          />
          {errors.title && <p className="text-xs text-destructive font-body">{errors.title}</p>}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-body font-medium">Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className={`h-12 text-base ${errors.category ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive font-body">{errors.category}</p>}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price" className="font-body font-medium">Price (GMD) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-heading font-bold text-primary">D</span>
            <Input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className={`pl-7 h-12 text-base ${errors.price ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.price && <p className="text-xs text-destructive font-body">{errors.price}</p>}
        </div>

        {/* Condition */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-body font-medium">Condition *</Label>
          <div className="flex gap-2">
            {CONDITIONS.map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setCondition(cond)}
                className={`flex-1 h-11 rounded-lg border-2 text-sm font-body font-medium transition-all ${
                  condition === cond
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
          {errors.condition && <p className="text-xs text-destructive font-body">{errors.condition}</p>}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location" className="font-body font-medium">Location *</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Banjul, Serrekunda"
            className={`h-12 text-base ${errors.location ? 'border-destructive' : ''}`}
          />
          {errors.location && <p className="text-xs text-destructive font-body">{errors.location}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" className="font-body font-medium">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item..."
            className="text-base min-h-[100px] resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={createListing.isPending}
          className="w-full h-12 text-base font-semibold"
        >
          {createListing.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Creating Listing...
            </span>
          ) : (
            'Post Listing'
          )}
        </Button>
      </form>
    </div>
  );
}

export default function CreateListing({ onSuccess, onCancel }: CreateListingProps) {
  return (
    <AuthGuard onCancel={onCancel}>
      <CreateListingForm onSuccess={onSuccess} onCancel={onCancel} />
    </AuthGuard>
  );
}
