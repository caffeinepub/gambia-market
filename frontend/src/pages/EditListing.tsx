import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import PhotoUpload from '../components/PhotoUpload';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useListing, useUpdateListing } from '../hooks/useQueries';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { ListingCategory, RealEstateSubCategory } from '../backend';
import type { ListingId, ExternalBlob } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginPrompt from '../components/LoginPrompt';

const CONDITIONS = ['New', 'Used', 'Refurbished'];

const CATEGORY_OPTIONS: { label: string; value: ListingCategory; icon: string }[] = [
  { label: 'Electronics', value: ListingCategory.electronics, icon: '📱' },
  { label: 'Phones', value: ListingCategory.phones, icon: '📞' },
  { label: 'Laptops', value: ListingCategory.laptops, icon: '💻' },
  { label: 'Clothing', value: ListingCategory.clothing, icon: '👗' },
  { label: 'Shoes', value: ListingCategory.shoes, icon: '👟' },
  { label: 'Fashion', value: ListingCategory.fashion, icon: '💍' },
  { label: 'Furniture', value: ListingCategory.furniture, icon: '🛋️' },
  { label: 'Appliances', value: ListingCategory.appliances, icon: '🏠' },
  { label: 'Cars & Trucks', value: ListingCategory.carsAndTrucks, icon: '🚗' },
  { label: 'Motorcycles', value: ListingCategory.motorcycles, icon: '🏍️' },
  { label: 'Bicycles', value: ListingCategory.bicycles, icon: '🚲' },
  { label: 'Spare Parts', value: ListingCategory.spareParts, icon: '🔧' },
  { label: 'Beauty', value: ListingCategory.beauty, icon: '💄' },
  { label: 'Health', value: ListingCategory.health, icon: '💊' },
  { label: 'Services', value: ListingCategory.services, icon: '🛠️' },
  { label: 'Pets', value: ListingCategory.pets, icon: '🐾' },
  { label: 'Real Estate', value: ListingCategory.realEstate, icon: '🏠' },
  { label: 'Other', value: ListingCategory.other, icon: '📦' },
];

const REAL_ESTATE_SUBCATEGORIES: { label: string; value: RealEstateSubCategory }[] = [
  { label: 'Land & Properties', value: RealEstateSubCategory.landAndProperties },
  { label: 'Apartments & Flats', value: RealEstateSubCategory.apartmentsAndFlats },
  { label: 'Houses for Sale', value: RealEstateSubCategory.housesForSale },
  { label: 'Houses for Rent', value: RealEstateSubCategory.housesForRent },
  { label: 'Commercial Spaces', value: RealEstateSubCategory.commercialSpaces },
  { label: 'Short-Let / Holiday Rentals', value: RealEstateSubCategory.shortLetHolidayRentals },
];

interface EditListingProps {
  listingId: ListingId;
  onSuccess: (id?: ListingId) => void;
  onCancel: () => void;
}

function EditListingForm({ listingId, onSuccess, onCancel }: EditListingProps) {
  const { data: listing, isLoading } = useListing(listingId);
  const updateListing = useUpdateListing();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory | ''>('');
  const [subCategory, setSubCategory] = useState<RealEstateSubCategory | ''>('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<ExternalBlob[]>([]);
  const [propertySize, setPropertySize] = useState('');
  const [numBedrooms, setNumBedrooms] = useState('');
  const [isFurnished, setIsFurnished] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRealEstate = category === ListingCategory.realEstate;

  useEffect(() => {
    if (listing && !initialized) {
      setTitle(listing.title);
      setDescription(listing.description);
      setCategory(listing.category as ListingCategory);
      setSubCategory((listing.subCategory as RealEstateSubCategory | undefined) ?? '');
      setPrice(Number(listing.price).toString());
      setCondition(listing.condition);
      setLocation(listing.location);
      setPhotos(listing.photos);
      setPropertySize(listing.propertySize ? Number(listing.propertySize).toString() : '');
      setNumBedrooms(listing.numBedrooms ? Number(listing.numBedrooms).toString() : '');
      setIsFurnished(listing.isFurnished ?? false);
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
        category: category as ListingCategory,
        subCategory: isRealEstate && subCategory ? (subCategory as string) : null,
        price: BigInt(Math.round(Number(price))),
        condition,
        photos,
        location: location.trim(),
        propertySize: isRealEstate && propertySize ? BigInt(Math.round(Number(propertySize))) : null,
        numBedrooms: isRealEstate && numBedrooms ? BigInt(Math.round(Number(numBedrooms))) : null,
        isFurnished: isRealEstate ? isFurnished : null,
      });
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
        <h1 className="font-display font-bold text-base text-foreground">Edit Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-5 max-w-2xl mx-auto w-full">
        <div className="flex flex-col gap-2">
          <Label className="font-body font-medium">Photos (up to 5)</Label>
          <PhotoUpload photos={photos} onPhotosChange={setPhotos} maxPhotos={5} />
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
          <Select value={category} onValueChange={(v) => { setCategory(v as ListingCategory); setSubCategory(''); }}>
            <SelectTrigger className={`h-12 text-base ${errors.category ? 'border-destructive' : ''}`}>
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive font-body">{errors.category}</p>}
        </div>

        {isRealEstate && (
          <div className="flex flex-col gap-1.5">
            <Label className="font-body font-medium flex items-center gap-1.5">
              <Home className="w-4 h-4 text-primary" />
              Property Type
            </Label>
            <Select value={subCategory} onValueChange={(v) => setSubCategory(v as RealEstateSubCategory)}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select property type..." />
              </SelectTrigger>
              <SelectContent>
                {REAL_ESTATE_SUBCATEGORIES.map((sub) => (
                  <SelectItem key={sub.value} value={sub.value}>{sub.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {isRealEstate && (
          <div className="flex flex-col gap-4 p-4 bg-muted/40 rounded-xl border border-border">
            <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Property Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-propertySize" className="font-body font-medium text-sm">Size (sq m)</Label>
                <Input
                  id="edit-propertySize"
                  type="number"
                  min="0"
                  value={propertySize}
                  onChange={(e) => setPropertySize(e.target.value)}
                  placeholder="e.g. 120"
                  className="h-11 text-base"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-numBedrooms" className="font-body font-medium text-sm">Bedrooms</Label>
                <Input
                  id="edit-numBedrooms"
                  type="number"
                  min="0"
                  value={numBedrooms}
                  onChange={(e) => setNumBedrooms(e.target.value)}
                  placeholder="e.g. 3"
                  className="h-11 text-base"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-isFurnished" className="font-body font-medium text-sm">Furnished</Label>
              <Switch
                id="edit-isFurnished"
                checked={isFurnished}
                onCheckedChange={setIsFurnished}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-price" className="font-body font-medium">Price (GMD) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display font-bold text-primary">D</span>
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
  const { identity } = useInternetIdentity();

  if (!identity) {
    return <LoginPrompt onCancel={onCancel} />;
  }

  return <EditListingForm listingId={listingId} onSuccess={onSuccess} onCancel={onCancel} />;
}
