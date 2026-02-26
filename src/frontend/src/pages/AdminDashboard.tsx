import React, { useState } from 'react';
import {
  ShieldCheck,
  LogOut,
  Package,
  Users,
  BarChart2,
  AlertCircle,
  Settings,
  Trash2,
  Check,
  X,
  PlusCircle,
  Tag,
  MapPin,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  useListings,
  useDeleteListing,
  useUpdateListingStatus,
  useGetAllReports,
  useUpdateReportStatus,
  useGetAllCategories,
  useAddAllowedCategory,
  useRemoveAllowedCategory,
} from '../hooks/useQueries';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminTab = 'overview' | 'listings' | 'reports' | 'users' | 'settings';

const TAB_CONFIG: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'listings', label: 'Listings', icon: Package },
  { id: 'reports', label: 'Reports', icon: AlertCircle },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === 'active') return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
      Active
    </span>
  );
  if (s === 'sold') return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
      Sold
    </span>
  );
  if (s === 'flagged') return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
      Flagged
    </span>
  );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
      {status}
    </span>
  );
}

function ReportStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === 'resolved') return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
      Resolved
    </span>
  );
  if (s === 'dismissed') return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      Dismissed
    </span>
  );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
      Pending
    </span>
  );
}

// ─── Tab: Overview ──────────────────────────────────────────────────────────
function OverviewTab() {
  const { data: listings = [], isLoading: listingsLoading } = useListings();
  const { data: reports = [], isLoading: reportsLoading } = useGetAllReports();
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategories();

  const uniqueSellers = new Set(listings.map((l) => l.sellerId.toString())).size;
  const recentListings = [...listings]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Listings',
      value: listingsLoading ? '…' : listings.length.toString(),
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Unique Sellers',
      value: listingsLoading ? '…' : uniqueSellers.toString(),
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-100 dark:bg-teal-900/30',
    },
    {
      label: 'Total Reports',
      value: reportsLoading ? '…' : reports.length.toString(),
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      label: 'Categories',
      value: categoriesLoading ? '…' : categories.length.toString(),
      icon: Tag,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          At a Glance
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground leading-tight">
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Listings */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Recent Listings
        </h2>
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          {listingsLoading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
          ) : recentListings.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No listings yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentListings.map((listing, idx) => (
                <li key={listing.id.toString()} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{listing.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">D {Number(listing.price).toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{listing.category}</span>
                    </div>
                  </div>
                  <StatusBadge status={listing.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Listings ──────────────────────────────────────────────────────────
function ListingsTab() {
  const { data: listings = [], isLoading } = useListings();
  const deleteListing = useDeleteListing();
  const updateStatus = useUpdateListingStatus();

  const sorted = [...listings].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  const handleDelete = (listingId: bigint, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteListing.mutate(listingId);
  };

  const handleStatusChange = (listingId: bigint, status: string) => {
    updateStatus.mutate({ listingId, status });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          All Listings ({sorted.length})
        </h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-16 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading listings…</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No listings found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((listing, idx) => (
            <div
              key={listing.id.toString()}
              className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm"
            >
              {/* Row 1: Index + Title */}
              <div className="flex items-start gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight truncate">
                    {listing.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-primary">
                      D {Number(listing.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">{listing.category}</span>
                    {listing.location && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {listing.location}
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge status={listing.status} />
              </div>

              {/* Row 2: Actions */}
              <div className="flex items-center gap-2 pl-9">
                <select
                  value={listing.status}
                  onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                  disabled={updateStatus.isPending}
                  className="flex-1 text-xs rounded-lg border border-border bg-background text-foreground px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="Active">Active</option>
                  <option value="Sold">Sold</option>
                  <option value="Flagged">Flagged</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleDelete(listing.id, listing.title)}
                  disabled={deleteListing.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors text-xs font-medium disabled:opacity-60"
                  title="Delete listing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Reports ────────────────────────────────────────────────────────────
function ReportsTab() {
  const { data: reports = [], isLoading } = useGetAllReports();
  const updateReport = useUpdateReportStatus();

  const sorted = [...reports].sort((a, b) => {
    const order: Record<string, number> = { pending: 0, resolved: 1, dismissed: 2 };
    return (order[a.status.toLowerCase()] ?? 3) - (order[b.status.toLowerCase()] ?? 3);
  });

  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n) + '…' : str;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Reports ({sorted.length})
        </h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-16 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading reports…</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-16 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No reports yet. The marketplace is clean!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((report) => {
            const isPending = report.status.toLowerCase() === 'pending';
            return (
              <div
                key={report.id.toString()}
                className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-muted-foreground mb-1">
                      Report #{report.id.toString()}
                    </p>
                    <p className="text-sm text-foreground leading-snug">
                      {truncate(report.reason, 120)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      Reporter: {report.reporterId.toString().slice(0, 16)}…
                    </p>
                  </div>
                  <ReportStatusBadge status={report.status} />
                </div>

                {isPending && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => updateReport.mutate({ reportId: report.id, status: 'resolved' })}
                      disabled={updateReport.isPending}
                      className="flex items-center gap-1.5 flex-1 justify-center px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 transition-colors text-xs font-medium disabled:opacity-60"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                    <button
                      type="button"
                      onClick={() => updateReport.mutate({ reportId: report.id, status: 'dismissed' })}
                      disabled={updateReport.isPending}
                      className="flex items-center gap-1.5 flex-1 justify-center px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors text-xs font-medium disabled:opacity-60"
                    >
                      <X className="w-3.5 h-3.5" />
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Users ─────────────────────────────────────────────────────────────
function UsersTab() {
  const { data: listings = [], isLoading } = useListings();

  type SellerRow = {
    sellerId: string;
    listingCount: number;
    joinedAt: bigint;
  };

  const sellers: SellerRow[] = React.useMemo(() => {
    const map = new Map<string, SellerRow>();
    for (const listing of listings) {
      const id = listing.sellerId.toString();
      const existing = map.get(id);
      if (!existing) {
        map.set(id, { sellerId: id, listingCount: 1, joinedAt: listing.createdAt });
      } else {
        existing.listingCount += 1;
        if (Number(listing.createdAt) < Number(existing.joinedAt)) {
          existing.joinedAt = listing.createdAt;
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.listingCount - a.listingCount);
  }, [listings]);

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Sellers ({sellers.length})
        </h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-16 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading users…</p>
        </div>
      ) : sellers.length === 0 ? (
        <div className="py-16 text-center">
          <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No sellers yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sellers.map((seller, idx) => (
            <div
              key={seller.sellerId}
              className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground font-mono truncate">
                  {seller.sellerId.slice(0, 20)}…
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Joined {formatDate(seller.joinedAt)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  <Package className="w-3 h-3" />
                  {seller.listingCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Settings ───────────────────────────────────────────────────────────
function SettingsTab() {
  const { data: categories = [], isLoading } = useGetAllCategories();
  const addCategory = useAddAllowedCategory();
  const removeCategory = useRemoveAllowedCategory();
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    addCategory.mutate(trimmed, {
      onSuccess: () => setNewCategory(''),
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Management */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Category Management
        </h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center">
              <Tag className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No categories found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {categories.map((cat) => (
                <li key={cat} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground capitalize">{cat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCategory.mutate(cat)}
                    disabled={removeCategory.isPending}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors disabled:opacity-60"
                    title={`Remove ${cat}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add new category */}
          <div className="p-4 border-t border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Add new category</p>
            <div className="flex items-center gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. sporting-goods"
                className="flex-1 text-sm h-9"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              />
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={addCategory.isPending || !newCategory.trim()}
                className="gap-1.5 h-9 shrink-0"
              >
                {addCategory.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Admin Account</p>
            <p className="text-xs text-muted-foreground">Bigalfu · Full Access</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This admin panel controls the entire Gambia Market platform. Changes take effect immediately.
          Handle with care — deletions are permanent.
        </p>
      </div>
    </div>
  );
}

// ─── Main AdminDashboard ─────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>
      {/* Fixed Admin Header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 px-4"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
      >
        <div className="max-w-2xl mx-auto h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Admin Dashboard</h1>
              <p className="text-[10px] text-white/50 leading-tight">Gambia Market</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Fixed Tab Bar — just below the header */}
      <div className="fixed top-[52px] left-0 right-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto overflow-x-auto scrollbar-none">
          <div className="flex items-stretch px-2 min-w-max">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Content — offset by header (52px) + tab bar (~44px) = 96px */}
      <div className="flex-1 overflow-y-auto pt-[96px] pb-8">
        <div className="max-w-2xl mx-auto px-4 pt-4">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'listings' && <ListingsTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}
