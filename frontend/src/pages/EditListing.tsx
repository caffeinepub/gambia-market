import { useState, useEffect } from 'react';
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
import { useListing, useUpdateListing, useCategories } from '../hooks/useQueries';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import type { ListingId, ExternalBlob } from '../backend';

const DEFAULT_CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Vehicles', 'Services', 'Furniture', 'Agriculture', 'Other'];
const CONDITIONS = ['New', 'Used', 'Refurbished'];

interface EditListingProps {
  listingId: ListingId;
  onSuccess: (id: ListingId) => void;
  onCancel: () => void;
}

function EditListingForm({ listingId, onSuccess, onCancel }: EditListingProps) {
  const { data: listing, isLoading } = useListing(listingId);
  const { data: categories } = useCategories();
  const updateListing = useUpdateListing();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<ExternalBlob[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  useEffect(() => {
    if (listing && !initialized) {
      setTitle(listing.title);
      setDescription(listing.description);
      setCategory(listing.category);
      setPrice(Number(listing.price).toString());
      setCondition(listing.condition);
      setLocation(listing.location);
      setPhotos(listing.photos);
      setInitialized(true);
    }
  }, [listing, initialized]);

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
      await updateListing.mutateAsync({
        listingId,
        title: title.trim(),
        description: description.trim(),
        category,
        price: BigInt(Math.round(Number(price))),
        condition,
        photos,
        location: location.trim(),
      });
      toast.success('Listing updated!');
      onSuccess(listingId);
    } catch {
      toast.error('Failed to update listing. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-14 bg-card z-10">
        <button onClick={onCancel} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body font-medium text-sm">Cancel</span>
        </button>
        <h1 className="font-heading font-bold text-base text-foreground">Edit Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-5">
        <div className="flex flex-col gap-2">
          <Label className="font-body font-medium">Photos (up to 5)</Label>
          <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={5} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-title" className="font-body font-medium">Title *</Label>
          <Input
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`h-12 text-base ${errors.title ? 'border-destructive' : ''}`}
          />
          {errors.title && <p className="text-xs text-destructive font-body">{errors.title}</p>}
        </div>

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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-price" className="font-body font-medium">Price (GMD) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-heading font-bold text-primary">D</span>
            <Input
              id="edit-price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`pl-7 h-12 text-base ${errors.price ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.price && <p className="text-xs text-destructive font-body">{errors.price}</p>}
        </div>

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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-location" className="font-body font-medium">Location *</Label>
          <Input
            id="edit-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`h-12 text-base ${errors.location ? 'border-destructive' : ''}`}
          />
          {errors.location && <p className="text-xs text-destructive font-body">{errors.location}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-description" className="font-body font-medium">Description</Label>
          <Textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-base min-h-[100px] resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={updateListing.isPending}
          className="w-full h-12 text-base font-semibold"
        >
          {updateListing.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </div>
  );
}

export default function EditListing({ listingId, onSuccess, onCancel }: EditListingProps) {
  return (
    <AuthGuard onCancel={onCancel}>
      <EditListingForm listingId={listingId} onSuccess={onSuccess} onCancel={onCancel} />
    </AuthGuard>
  );
}
