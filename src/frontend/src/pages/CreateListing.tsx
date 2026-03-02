import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowLeft,
  Bath,
  Bed,
  Camera,
  CheckCircle2,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  Maximize2,
  Sparkles,
  Tag,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
  type ExternalBlob,
  ListingCategory,
  type RealEstateSubCategory,
} from "../backend";
import LoginPrompt from "../components/LoginPrompt";
import PhotoUpload from "../components/PhotoUpload";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateListing } from "../hooks/useQueries";

interface CreateListingProps {
  onBack: () => void;
  onSuccess?: (listingId: bigint) => void;
}

const CONDITIONS: {
  value: string;
  label: string;
  desc: string;
  color: string;
}[] = [
  {
    value: "New",
    label: "New",
    desc: "Never used",
    color: "oklch(0.52 0.18 155)",
  },
  {
    value: "Like New",
    label: "Like New",
    desc: "Barely used",
    color: "oklch(0.52 0.18 175)",
  },
  {
    value: "Good",
    label: "Good",
    desc: "Minor wear",
    color: "oklch(0.52 0.18 220)",
  },
  {
    value: "Fair",
    label: "Fair",
    desc: "Noticeable wear",
    color: "oklch(0.58 0.18 65)",
  },
  {
    value: "Poor",
    label: "Poor",
    desc: "Heavy wear",
    color: "oklch(0.52 0.18 25)",
  },
];

const GAMBIA_LOCATIONS = [
  "Banjul",
  "Serrekunda",
  "Brikama",
  "Bakau",
  "Farafenni",
  "Lamin",
  "Sukuta",
  "Soma",
  "Basse",
  "Janjanbureh",
  "Gunjur",
  "Kartong",
  "Tanji",
  "Kololi",
  "Kotu",
  "Sanyang",
  "Brusubi",
  "Yundum",
];

// Numeric steps for progress (category removed — always defaults to "other")
const STEPS = [
  { id: "photos", icon: Camera, label: "Photos" },
  { id: "details", icon: Tag, label: "Details" },
  { id: "pricing", icon: DollarSign, label: "Pricing" },
  { id: "location", icon: MapPin, label: "Location" },
];

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
  accent,
  step,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  accent?: boolean;
  step?: number;
}) {
  return (
    <div
      className="rounded-2xl border border-border overflow-hidden shadow-sm"
      style={{ background: "var(--card)" }}
    >
      {/* Section header */}
      <div
        className="px-4 py-3 border-b border-border flex items-center gap-3"
        style={
          accent
            ? {
                background:
                  "linear-gradient(135deg, oklch(0.96 0.04 155), oklch(0.94 0.04 175))",
              }
            : { background: "var(--muted)" }
        }
      >
        {step !== undefined && (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-display"
            style={{
              background: accent
                ? "linear-gradient(135deg, oklch(0.52 0.18 155), oklch(0.48 0.16 175))"
                : "var(--secondary)",
              color: accent ? "white" : "var(--muted-foreground)",
            }}
          >
            {step}
          </div>
        )}
        {!step && Icon && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: accent
                ? "linear-gradient(135deg, oklch(0.52 0.18 155), oklch(0.48 0.16 175))"
                : "var(--secondary)",
            }}
          >
            <Icon
              className="w-3.5 h-3.5"
              style={{ color: accent ? "white" : "var(--muted-foreground)" }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm text-foreground leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-body text-muted-foreground leading-tight mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
      <p className="text-xs text-destructive">{message}</p>
    </div>
  );
}

export default function CreateListing({
  onBack,
  onSuccess,
}: CreateListingProps) {
  const { identity } = useInternetIdentity();
  const createListing = useCreateListing();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Category is fixed — no UI picker (always defaults to "other")
  const [category] = useState<ListingCategory | "">(ListingCategory.other);
  const [subCategory] = useState<RealEstateSubCategory | "">("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [photos, setPhotos] = useState<ExternalBlob[]>([]);
  const [propertySize, setPropertySize] = useState("");
  const [numBedrooms, setNumBedrooms] = useState("");
  const [numBathrooms, setNumBathrooms] = useState("");
  const [isFurnished, setIsFurnished] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRealEstate = category === ListingCategory.realEstate;

  // Compute active step based on filled fields (no category step)
  const activeStep = useMemo(() => {
    if (!price && !location) return 2;
    if (price && !location) return 3;
    return 4;
  }, [price, location]);

  // Progress percentage (category always filled, so 6 fields total)
  const progressPct = useMemo(() => {
    let filled = 0;
    if (photos.length > 0) filled++;
    if (title.trim()) filled++;
    if (description.trim()) filled++;
    if (price && !Number.isNaN(Number(price)) && Number(price) > 0) filled++;
    if (condition) filled++;
    if (location.trim()) filled++;
    return Math.round((filled / 6) * 100);
  }, [photos, title, description, price, condition, location]);

  // Price preview formatted
  const pricePreview = useMemo(() => {
    const n = Number(price);
    if (!price || Number.isNaN(n) || n <= 0) return null;
    return n.toLocaleString("en-GM");
  }, [price]);

  // Location suggestions filter
  const locationSuggestions = useMemo(() => {
    if (!location || location.length < 1) return GAMBIA_LOCATIONS.slice(0, 6);
    return GAMBIA_LOCATIONS.filter((l) =>
      l.toLowerCase().includes(location.toLowerCase()),
    ).slice(0, 6);
  }, [location]);

  if (!identity) {
    return <LoginPrompt onCancel={onBack} />;
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price || Number.isNaN(Number(price)) || Number(price) <= 0)
      newErrors.price = "Enter a valid price";
    if (!condition) newErrors.condition = "Select the item condition";
    if (!location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const listingId = await createListing.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category: category as ListingCategory,
        subCategory:
          isRealEstate && subCategory ? (subCategory as string) : null,
        price: BigInt(Math.round(Number(price))),
        condition,
        photos,
        location: location.trim(),
        propertySize:
          isRealEstate && propertySize
            ? BigInt(Math.round(Number(propertySize)))
            : null,
        numBedrooms:
          isRealEstate && numBedrooms
            ? BigInt(Math.round(Number(numBedrooms)))
            : null,
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

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 border-b border-border"
        style={{ background: "var(--card)" }}
      >
        {/* Progress bar */}
        <div className="h-1 w-full bg-muted overflow-hidden">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${progressPct}%`,
              background:
                progressPct === 100
                  ? "linear-gradient(90deg, oklch(0.52 0.18 155), oklch(0.52 0.18 175))"
                  : "linear-gradient(90deg, oklch(0.52 0.18 155), oklch(0.48 0.16 175))",
            }}
          />
        </div>

        <div className="px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-base text-foreground leading-tight truncate">
              Post a Listing
            </h1>
            <p className="text-xs font-body text-muted-foreground">
              {progressPct}% complete — Step {activeStep} of {STEPS.length}:{" "}
              {STEPS[activeStep - 1]?.label}
            </p>
          </div>

          {progressPct === 100 && (
            <Badge
              className="shrink-0 text-xs font-body"
              style={{
                background: "oklch(0.52 0.18 155)",
                color: "white",
                border: "none",
              }}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Ready
            </Badge>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto px-4 py-5 space-y-4 pb-28"
      >
        {/* Error summary at top when there are errors */}
        {errorCount > 0 && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix {errorCount} error{errorCount > 1 ? "s" : ""} before
              posting.
            </AlertDescription>
          </Alert>
        )}

        {/* ─── Section 1: Photos ─── */}
        <SectionCard
          title="Add Photos"
          subtitle="First photo is the cover. Up to 8 photos."
          icon={Camera}
          step={1}
          accent
        >
          {photos.length === 0 ? (
            <div
              className="rounded-xl border-2 border-dashed flex flex-col items-center text-center p-8 transition-colors"
              style={{
                borderColor: "oklch(0.72 0.1 155)",
                background: "oklch(0.97 0.02 155)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "oklch(0.92 0.06 155)" }}
              >
                <Camera
                  className="w-7 h-7"
                  style={{ color: "oklch(0.42 0.18 155)" }}
                />
              </div>
              <p className="font-display font-bold text-sm text-foreground mb-1">
                Tap to add photos
              </p>
              <p className="text-xs font-body text-muted-foreground mb-4">
                Great photos get more buyers!
              </p>
              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={8}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={8}
              />
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: "oklch(0.42 0.18 155)" }}
                />
                <span
                  className="text-xs font-body"
                  style={{ color: "oklch(0.42 0.18 155)" }}
                >
                  {photos.length} photo{photos.length !== 1 ? "s" : ""} added
                </span>
              </div>
            </div>
          )}
        </SectionCard>

        {/* ─── Section 2: Item Details ─── */}
        <SectionCard
          title="Item Details"
          subtitle="Be clear and honest to attract serious buyers"
          icon={Tag}
          step={2}
        >
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-foreground"
              >
                Title <span className="text-destructive">*</span>
              </Label>
              <span
                className={`text-xs font-body transition-colors ${
                  title.length > 70
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {title.length}/80
              </span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 80) {
                  setTitle(e.target.value);
                  if (errors.title)
                    setErrors((prev) => ({ ...prev, title: "" }));
                }
              }}
              placeholder="e.g. iPhone 14 Pro — 256GB Space Black"
              className={`transition-all ${errors.title ? "border-destructive ring-destructive/20 ring-2" : ""}`}
              style={{ fontSize: "16px" }}
            />
            <FieldError message={errors.title} />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-foreground"
              >
                Description <span className="text-destructive">*</span>
              </Label>
              <span
                className={`text-xs font-body transition-colors ${
                  description.length > 450
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              placeholder="Describe your item — condition, features, any defects, reason for selling…"
              rows={4}
              className={`resize-none transition-all ${errors.description ? "border-destructive ring-destructive/20 ring-2" : ""}`}
              style={{ fontSize: "16px" }}
            />
            <FieldError message={errors.description} />
          </div>
        </SectionCard>

        {/* ─── Section 3: Pricing ─── */}
        <SectionCard
          title="Pricing"
          subtitle="Set your price in Gambian Dalasi (GMD)"
          icon={DollarSign}
          step={3}
          accent
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="price"
              className="text-sm font-semibold text-foreground"
            >
              Price (GMD) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-black text-2xl select-none pointer-events-none"
                style={{ color: "oklch(0.42 0.18 155)" }}
              >
                D
              </span>
              <input
                id="price"
                type="number"
                min="0"
                inputMode="decimal"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price)
                    setErrors((prev) => ({ ...prev, price: "" }));
                }}
                placeholder="0"
                className={`w-full pl-10 pr-16 py-5 rounded-xl border-2 font-display font-black text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all ${
                  errors.price
                    ? "border-destructive ring-2 ring-destructive/20"
                    : "border-border focus:border-primary"
                }`}
                style={{
                  fontSize: "28px",
                  background: "var(--background)",
                  lineHeight: 1,
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-body font-semibold text-muted-foreground pointer-events-none">
                GMD
              </span>
            </div>

            {/* Price preview pill */}
            {pricePreview && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: "oklch(0.93 0.05 155)" }}
              >
                <Sparkles
                  className="w-4 h-4 shrink-0"
                  style={{ color: "oklch(0.42 0.18 155)" }}
                />
                <span
                  className="font-display font-bold text-sm"
                  style={{ color: "oklch(0.35 0.16 155)" }}
                >
                  D {pricePreview} Gambian Dalasi
                </span>
              </div>
            )}
            <FieldError message={errors.price} />
          </div>

          {/* Condition — inline chips */}
          <div className="space-y-2 pt-1">
            <Label className="text-sm font-semibold text-foreground">
              Condition <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CONDITIONS.map((c) => {
                const isSelected = condition === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      setCondition(c.value);
                      if (errors.condition)
                        setErrors((prev) => ({ ...prev, condition: "" }));
                    }}
                    className="flex flex-col items-start px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-200 active:scale-95 focus:outline-none"
                    style={{
                      borderColor: isSelected ? c.color : "var(--border)",
                      background: isSelected
                        ? `${c.color}18`
                        : "var(--background)",
                    }}
                  >
                    <span
                      className="font-display font-bold text-sm"
                      style={{
                        color: isSelected ? c.color : "var(--foreground)",
                      }}
                    >
                      {c.label}
                    </span>
                    <span className="text-[11px] font-body text-muted-foreground">
                      {c.desc}
                    </span>
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.condition} />
          </div>
        </SectionCard>

        {/* ─── Section 4: Location ─── */}
        <SectionCard
          title="Location"
          subtitle="Where is the item or property located?"
          icon={MapPin}
          step={4}
        >
          <div className="space-y-1.5 relative">
            <Label
              htmlFor="location"
              className="text-sm font-semibold text-foreground"
            >
              Town / Area <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "oklch(0.52 0.18 155)" }}
              />
              <Input
                id="location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(true);
                  if (errors.location)
                    setErrors((prev) => ({ ...prev, location: "" }));
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowLocationSuggestions(false), 150)
                }
                placeholder="e.g. Banjul, Serrekunda…"
                className={`pl-9 transition-all ${errors.location ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                style={{ fontSize: "16px" }}
                autoComplete="off"
              />
            </div>

            {/* Location suggestions dropdown */}
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-border overflow-hidden shadow-lg z-30"
                style={{ background: "var(--card)" }}
              >
                {locationSuggestions.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onMouseDown={() => {
                      setLocation(loc);
                      setShowLocationSuggestions(false);
                      if (errors.location)
                        setErrors((prev) => ({ ...prev, location: "" }));
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/40 last:border-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-body text-foreground">
                      {loc}
                    </span>
                    <span className="text-xs font-body text-muted-foreground ml-auto">
                      Gambia
                    </span>
                  </button>
                ))}
              </div>
            )}
            <FieldError message={errors.location} />
          </div>

          {/* Quick-pick chips */}
          <div className="flex flex-wrap gap-2">
            {[
              "Banjul",
              "Serrekunda",
              "Brikama",
              "Bakau",
              "Kololi",
              "Lamin",
            ].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLocation(l);
                  if (errors.location)
                    setErrors((prev) => ({ ...prev, location: "" }));
                }}
                className="px-3 py-1.5 rounded-full border text-xs font-body transition-all active:scale-95"
                style={{
                  borderColor:
                    location === l ? "oklch(0.42 0.18 155)" : "var(--border)",
                  background:
                    location === l
                      ? "oklch(0.93 0.05 155)"
                      : "var(--background)",
                  color:
                    location === l
                      ? "oklch(0.35 0.16 155)"
                      : "var(--muted-foreground)",
                  fontWeight: location === l ? 600 : 400,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* ─── Section 6: Real Estate Details (conditional) ─── */}
        {isRealEstate && (
          <SectionCard
            title="Property Details"
            subtitle="Optional — more info attracts better buyers"
            icon={Home}
            accent
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Size */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="propertySize"
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Size (m²)
                </Label>
                <Input
                  id="propertySize"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={propertySize}
                  onChange={(e) => setPropertySize(e.target.value)}
                  placeholder="e.g. 120"
                  style={{ fontSize: "16px" }}
                />
              </div>

              {/* Bedrooms */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="numBedrooms"
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <Bed className="w-3.5 h-3.5" />
                  Bedrooms
                </Label>
                <Select value={numBedrooms} onValueChange={setNumBedrooms}>
                  <SelectTrigger style={{ fontSize: "16px" }}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Studio", "1", "2", "3", "4", "5", "6+"].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n === "Studio"
                          ? "Studio"
                          : `${n} bed${n === "1" ? "" : "s"}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="numBathrooms"
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <Bath className="w-3.5 h-3.5" />
                  Bathrooms
                </Label>
                <Select value={numBathrooms} onValueChange={setNumBathrooms}>
                  <SelectTrigger style={{ fontSize: "16px" }}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4+"].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n} bath{n === "1" ? "" : "s"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Furnished toggle */}
            <div
              className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-border"
              style={{ background: "var(--background)" }}
            >
              <div>
                <Label
                  htmlFor="isFurnished"
                  className="text-sm font-semibold text-foreground cursor-pointer"
                >
                  Furnished Property
                </Label>
                <p className="text-xs font-body text-muted-foreground mt-0.5">
                  Comes with furniture and fittings
                </p>
              </div>
              <Switch
                id="isFurnished"
                checked={isFurnished}
                onCheckedChange={setIsFurnished}
              />
            </div>
          </SectionCard>
        )}

        {/* ─── Progress summary ─── */}
        <div
          className="rounded-2xl border border-border p-4"
          style={{ background: "var(--card)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-body font-semibold text-foreground">
              Listing completeness
            </span>
            <span
              className="text-sm font-display font-bold"
              style={{
                color:
                  progressPct === 100
                    ? "oklch(0.42 0.18 155)"
                    : "var(--muted-foreground)",
              }}
            >
              {progressPct}%
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
          {progressPct < 100 && (
            <p className="text-xs font-body text-muted-foreground mt-2">
              Fill in all required fields to maximize visibility
            </p>
          )}
          {progressPct === 100 && (
            <p
              className="text-xs font-body mt-2"
              style={{ color: "oklch(0.42 0.18 155)" }}
            >
              ✓ All required fields complete. Ready to post!
            </p>
          )}
        </div>

        {/* ─── Submit ─── */}
        <div className="space-y-2">
          <button
            type="submit"
            disabled={createListing.isPending}
            className="w-full py-4 rounded-2xl font-display font-bold text-base text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            style={{
              background: createListing.isPending
                ? "oklch(0.65 0.1 155)"
                : "linear-gradient(135deg, oklch(0.52 0.18 155) 0%, oklch(0.48 0.16 175) 100%)",
              boxShadow: createListing.isPending
                ? "none"
                : "0 4px 20px oklch(0.42 0.18 155 / 0.45), 0 2px 8px oklch(0.42 0.18 155 / 0.3)",
            }}
          >
            {createListing.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting your listing…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Post Listing
              </span>
            )}
          </button>
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-full text-muted-foreground hover:text-foreground"
            disabled={createListing.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
