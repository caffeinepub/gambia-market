import React from 'react';
import {
  ShieldCheck,
  LogOut,
  Package,
  Users,
  MessageSquare,
  TrendingUp,
  MapPin,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useListings } from '../hooks/useQueries';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { data: listings = [], isLoading } = useListings();

  const totalListings = listings.length;
  // Approximate unique users from unique seller IDs
  const uniqueSellers = new Set(listings.map((l) => l.sellerId.toString())).size;

  const recentListings = [...listings]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 10);

  const stats = [
    {
      label: 'Total Listings',
      value: isLoading ? '...' : totalListings.toString(),
      icon: Package,
      color: '#16a34a',
      bg: 'rgba(22,163,74,0.1)',
    },
    {
      label: 'Unique Sellers',
      value: isLoading ? '...' : uniqueSellers.toString(),
      icon: Users,
      color: '#0d9488',
      bg: 'rgba(13,148,136,0.1)',
    },
    {
      label: 'Active Markets',
      value: '1',
      icon: TrendingUp,
      color: '#7c3aed',
      bg: 'rgba(124,58,237,0.1)',
    },
    {
      label: 'Messages Sent',
      value: '—',
      icon: MessageSquare,
      color: '#db7706',
      bg: 'rgba(219,119,6,0.1)',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Admin Header */}
      <div
        className="px-4 pt-5 pb-6"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-white/60">Gambia Market Control Panel</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Welcome */}
          <div className="mt-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/80">
              Welcome back, <span className="font-bold text-white">Bigalfu</span>. Here's an
              overview of Gambia Market.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-6 mt-5">
        {/* Stats Grid */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-3">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border p-4"
                  style={{ background: 'var(--card)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: stat.bg }}
                    >
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Listings */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-3">Recent Listings</h2>
          <div
            className="rounded-2xl border border-border overflow-hidden"
            style={{ background: 'var(--card)' }}
          >
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Loading listings...</p>
              </div>
            ) : recentListings.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
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
                      <p className="text-sm font-semibold text-foreground truncate">
                        {listing.title}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Tag className="w-3 h-3" />
                          D {Number(listing.price).toLocaleString()}
                        </span>
                        {listing.location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {listing.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: 'rgba(22,163,74,0.1)',
                        color: '#16a34a',
                      }}
                    >
                      Active
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Gambia Market Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}
