import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { ListingCategory, RealEstateSubCategory } from '../backend';
import { useCreateListing } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import PhotoUpload from '../components/PhotoUpload';

interface CreateListingProps {
  onBack: () => void;
  onSuccess: () => void;
}

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const CATEGORIES = [
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

const RE_SUBCATEGORIES = [
  { value: RealEstateSubCategory.landAndProperties, label: 'Land & Properties' },
  { value: RealEstateSubCategory.apartmentsAndFlats, label: 'Apartments & Flats' },
  { value: RealEstateSubCategory.housesForSale, label: 'Houses for Sale' },
  { value: RealEstateSubCategory.housesForRent, label: 'Houses for Rent' },
  { value: RealEstateSubCategory.commercialSpaces, label: 'Commercial Spaces' },
  { value: RealEstateSubCategory.shortLetHolidayRentals, label: 'Short Let / Holiday Rentals' },
];

export default function CreateListing({ onBack, onSuccess }: CreateListingProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>(ListingCategory.other);
  const [subCategory, setSubCategory] = useState<RealEstateSubCategory | null>(null);
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<ExternalBlob[]>([]);
  const [propertySize, setPropertySize] = useState('');
  const [numBedrooms, setNumBedrooms] = useState('');
  const [isFurnished, setIsFurnished] = useState<boolean | null>(null);

  const createListing = useCreateListing();
  const isRealEstate = category === ListingCategory.realEstate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !location.trim()) return;

    await createListing.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      category,
      subCategory: isRealEstate ? subCategory : null,
      price: BigInt(Math.round(parseFloat(price))),
      condition,
      photos,
      location: location.trim(),
      propertySize: isRealEstate && propertySize ? BigInt(parseInt(propertySize)) : null,
      numBedrooms: isRealEstate && numBedrooms ? BigInt(parseInt(numBedrooms)) : null,
      isFurnished: isRealEstate ? isFurnished : null,
    });
    onSuccess();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";
  const labelClass = "block text-xs font-body font-semibold text-foreground mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-base text-foreground">Create Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-5 space-y-5">
        {/* Photos */}
        <div>
          <label className={labelClass}>Photos</label>
          <PhotoUpload photos={photos} onPhotosChange={setPhotos} maxPhotos={5} />
        </div>

        {/* Title */}
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you selling?"
            required
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ListingCategory)}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Real Estate subcategory */}
        {isRealEstate && (
          <div>
            <label className={labelClass}>Sub-Category</label>
            <select
              value={subCategory ?? ''}
              onChange={(e) => setSubCategory(e.target.value as RealEstateSubCategory || null)}
              className={inputClass}
            >
              <option value="">Select sub-category</option>
              {RE_SUBCATEGORIES.map((sc) => (
                <option key={sc.value} value={sc.value}>{sc.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <div>
          <label className={labelClass}>Price (GMD) *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body font-semibold text-muted-foreground">D</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              required
              min="0"
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className={labelClass}>Condition *</label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(c)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-body font-medium transition-all ${
                  condition === c
                    ? 'border-primary text-primary-foreground'
                    : 'border-border text-foreground hover:border-primary/40'
                }`}
                style={condition === c ? { background: 'var(--primary)' } : {}}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={labelClass}>Location *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Banjul, Serrekunda"
            required
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item…"
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Real Estate extras */}
        {isRealEstate && (
          <>
            <div>
              <label className={labelClass}>Property Size (m²)</label>
              <input
                type="number"
                value={propertySize}
                onChange={(e) => setPropertySize(e.target.value)}
                placeholder="e.g. 120"
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Number of Bedrooms</label>
              <input
                type="number"
                value={numBedrooms}
                onChange={(e) => setNumBedrooms(e.target.value)}
                placeholder="e.g. 3"
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Furnished</label>
              <div className="flex gap-3">
                {[{ label: 'Yes', value: true }, { label: 'No', value: false }, { label: 'Not specified', value: null }].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setIsFurnished(opt.value)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-body font-medium transition-all ${
                      isFurnished === opt.value
                        ? 'border-primary text-primary-foreground'
                        : 'border-border text-foreground hover:border-primary/40'
                    }`}
                    style={isFurnished === opt.value ? { background: 'var(--primary)' } : {}}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!title.trim() || !price || !location.trim() || createListing.isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-body font-semibold text-primary-foreground transition-all duration-200 shadow-button disabled:opacity-60"
          style={{ background: 'var(--primary)' }}
        >
          <Plus className="w-5 h-5" />
          {createListing.isPending ? 'Creating…' : 'Post Listing'}
        </button>
      </form>
    </div>
  );
}
