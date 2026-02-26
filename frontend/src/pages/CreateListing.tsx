import React, { useState } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PhotoUpload from '../components/PhotoUpload';
import { useCreateListing } from '../hooks/useQueries';
import { ListingCategory, RealEstateSubCategory, ExternalBlob } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginPrompt from '../components/LoginPrompt';

interface CreateListingProps {
  onBack: () => void;
  onSuccess?: (listingId: bigint) => void;
}

const CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: ListingCategory.carsAndTrucks, label: 'Cars & Trucks' },
  { value: ListingCategory.motorcycles, label: 'Motorcycles' },
  { value: ListingCategory.bicycles, label: 'Bicycles' },
  { value: ListingCategory.spareParts, label: 'Spare Parts' },
  { value: ListingCategory.electronics, label: 'Electronics' },
  { value: ListingCategory.phones, label: 'Phones' },
  { value: ListingCategory.laptops, label: 'Laptops' },
  { value: ListingCategory.furniture, label: 'Furniture' },
  { value: ListingCategory.appliances, label: 'Appliances' },
  { value: ListingCategory.clothing, label: 'Clothing' },
  { value: ListingCategory.shoes, label: 'Shoes' },
  { value: ListingCategory.fashion, label: 'Fashion' },
  { value: ListingCategory.beauty, label: 'Beauty' },
  { value: ListingCategory.health, label: 'Health' },
  { value: ListingCategory.services, label: 'Services' },
  { value: ListingCategory.pets, label: 'Pets' },
  { value: ListingCategory.realEstate, label: 'Real Estate' },
  { value: ListingCategory.other, label: 'Other' },
];

const REAL_ESTATE_SUBCATEGORIES: { value: RealEstateSubCategory; label: string }[] = [
  { value: RealEstateSubCategory.landAndProperties, label: 'Land & Properties' },
  { value: RealEstateSubCategory.apartmentsAndFlats, label: 'Apartments & Flats' },
  { value: RealEstateSubCategory.housesForSale, label: 'Houses for Sale' },
  { value: RealEstateSubCategory.housesForRent, label: 'Houses for Rent' },
  { value: RealEstateSubCategory.commercialSpaces, label: 'Commercial Spaces' },
  { value: RealEstateSubCategory.shortLetHolidayRentals, label: 'Short Let / Holiday Rentals' },
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function CreateListing({ onBack, onSuccess }: CreateListingProps) {
  const { identity } = useInternetIdentity();
  const createListing = useCreateListing();

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRealEstate = category === ListingCategory.realEstate;

  if (!identity) {
    return <LoginPrompt onCancel={onBack} />;
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Valid price is required';
    if (!condition) newErrors.condition = 'Condition is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (isRealEstate && !subCategory) newErrors.subCategory = 'Sub-category is required for Real Estate';
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
      if (onSuccess) {
        onSuccess(listingId);
      } else {
        onBack();
      }
    } catch {
      // Error handled by mutation's onError toast
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Create Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Photos */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Photos</Label>
          <PhotoUpload photos={photos} onPhotosChange={setPhotos} maxPhotos={8} />
          <p className="text-xs text-muted-foreground">Add up to 8 photos. First photo will be the cover.</p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-foreground">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
            placeholder="e.g. Toyota Corolla 2018"
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-foreground">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: '' })); }}
            placeholder="Describe your item in detail..."
            rows={4}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={category}
            onValueChange={(val) => {
              setCategory(val as ListingCategory);
              setSubCategory('');
              setErrors(prev => ({ ...prev, category: '' }));
            }}
          >
            <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>

        {/* Real Estate Sub-category */}
        {isRealEstate && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Sub-category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={subCategory}
              onValueChange={(val) => {
                setSubCategory(val as RealEstateSubCategory);
                setErrors(prev => ({ ...prev, subCategory: '' }));
              }}
            >
              <SelectTrigger className={errors.subCategory ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                {REAL_ESTATE_SUBCATEGORIES.map((sub) => (
                  <SelectItem key={sub.value} value={sub.value}>
                    {sub.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subCategory && <p className="text-xs text-destructive">{errors.subCategory}</p>}
          </div>
        )}

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium text-foreground">
            Price (GMD) <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">D</span>
            <Input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => { setPrice(e.target.value); setErrors(prev => ({ ...prev, price: '' })); }}
              placeholder="0"
              className={`pl-7 ${errors.price ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Condition <span className="text-destructive">*</span>
          </Label>
          <Select
            value={condition}
            onValueChange={(val) => { setCondition(val); setErrors(prev => ({ ...prev, condition: '' })); }}
          >
            <SelectTrigger className={errors.condition ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITIONS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-xs text-destructive">{errors.condition}</p>}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-foreground">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => { setLocation(e.target.value); setErrors(prev => ({ ...prev, location: '' })); }}
            placeholder="e.g. Banjul, Gambia"
            className={errors.location ? 'border-destructive' : ''}
          />
          {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
        </div>

        {/* Real Estate specific fields */}
        {isRealEstate && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border">
            <h3 className="text-sm font-semibold text-foreground">Real Estate Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertySize" className="text-sm font-medium text-foreground">
                  Property Size (m²)
                </Label>
                <Input
                  id="propertySize"
                  type="number"
                  min="0"
                  value={propertySize}
                  onChange={(e) => setPropertySize(e.target.value)}
                  placeholder="e.g. 120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numBedrooms" className="text-sm font-medium text-foreground">
                  Bedrooms
                </Label>
                <Input
                  id="numBedrooms"
                  type="number"
                  min="0"
                  value={numBedrooms}
                  onChange={(e) => setNumBedrooms(e.target.value)}
                  placeholder="e.g. 3"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="isFurnished"
                checked={isFurnished}
                onCheckedChange={setIsFurnished}
              />
              <Label htmlFor="isFurnished" className="text-sm font-medium text-foreground cursor-pointer">
                Furnished
              </Label>
            </div>
          </div>
        )}

        {/* Error summary */}
        {Object.keys(errors).filter(k => errors[k]).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the errors above before submitting.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={createListing.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={createListing.isPending}
          >
            {createListing.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Listing'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
