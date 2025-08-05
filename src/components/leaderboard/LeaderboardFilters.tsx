'use client';

import { motion } from 'framer-motion';
import { 
  Filter, 
  Calendar, 
  Trophy, 
  MapPin, 
  X,
  Clock,
  Target,
  Users
} from 'lucide-react';
import { LeaderboardFilters } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

interface LeaderboardFiltersProps {
  filters: LeaderboardFilters;
  onFiltersChange: (filters: LeaderboardFilters) => void;
  userCountry?: string;
  availableCountries: string[];
}

const timePeriodOptions = [
  { value: 'today', label: 'Today', icon: Clock },
  { value: 'week', label: 'This Week', icon: Calendar },
  { value: 'month', label: 'This Month', icon: Calendar },
  { value: 'all-time', label: 'All Time', icon: Trophy },
] as const;

const gameModeOptions = [
  { value: 'all', label: 'All Modes', icon: Target },
  { value: 'streak', label: 'Streak', icon: Trophy },
  { value: 'practice', label: 'Practice', icon: Target },
  { value: 'versus', label: 'Versus', icon: Users },
] as const;

const regionOptions = [
  { value: 'all', label: 'Global', icon: MapPin },
  { value: 'local', label: 'Your Region', icon: MapPin },
] as const;

export function LeaderboardFilters({ 
  filters, 
  onFiltersChange, 
  userCountry,
  availableCountries = []
}: LeaderboardFiltersProps) {
  const updateFilter = (key: keyof LeaderboardFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      timePeriod: 'all-time',
      gameMode: 'all',
      region: 'all',
      sortBy: 'streak'
    });
  };

  const hasActiveFilters = filters.timePeriod !== 'all-time' || 
                          filters.gameMode !== 'all' || 
                          filters.region !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="glass" className="p-6 mb-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Time Period Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Time Period
            </label>
            <div className="flex flex-wrap gap-2">
              {timePeriodOptions.map((option) => {
                const Icon = option.icon;
                const isActive = filters.timePeriod === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateFilter('timePeriod', option.value)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 relative overflow-hidden
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent -translate-x-full"
                        animate={{ translateX: ["100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Game Mode Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Game Mode
            </label>
            <div className="flex flex-wrap gap-2">
              {gameModeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = filters.gameMode === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateFilter('gameMode', option.value)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 relative overflow-hidden
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent -translate-x-full"
                        animate={{ translateX: ["100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Region
            </label>
            <div className="flex flex-wrap gap-2">
              {regionOptions.map((option) => {
                const Icon = option.icon;
                const isActive = filters.region === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateFilter('region', option.value)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 relative overflow-hidden
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                      }
                    `}
                    disabled={option.value === 'local' && !userCountry}
                  >
                    <Icon className="w-4 h-4" />
                    {option.value === 'local' && userCountry 
                      ? `${option.label} (${userCountry})` 
                      : option.label
                    }
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent -translate-x-full"
                        animate={{ translateX: ["100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-border/20"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Active filters:</span>
              <div className="flex flex-wrap gap-1">
                {filters.timePeriod !== 'all-time' && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    {timePeriodOptions.find(o => o.value === filters.timePeriod)?.label}
                  </span>
                )}
                {filters.gameMode !== 'all' && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    {gameModeOptions.find(o => o.value === filters.gameMode)?.label}
                  </span>
                )}
                {filters.region !== 'all' && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    {filters.region === 'local' ? `Your Region (${userCountry})` : 'Custom Region'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}