/**
 * Supabase Usage Monitor
 * 
 * Simple utility to track database operations and estimate egress usage
 * for staying within free tier limits.
 */

interface UsageMetrics {
  queries: number;
  dataTransferred: number; // rough estimate in bytes
  realtimeConnections: number;
  lastReset: number;
}

class SupabaseUsageMonitor {
  private metrics: UsageMetrics = {
    queries: 0,
    dataTransferred: 0,
    realtimeConnections: 0,
    lastReset: Date.now()
  };

  private readonly DAILY_RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly FREE_TIER_MONTHLY_LIMIT = 2 * 1024 * 1024 * 1024; // 2GB

  constructor() {
    this.loadMetrics();
    this.setupPeriodicReset();
  }

  /**
   * Track a database query
   */
  trackQuery(operation: string, estimatedResponseSize = 1024) {
    try {
      this.resetIfNeeded();
      this.metrics.queries++;
      this.metrics.dataTransferred += estimatedResponseSize;
      this.saveMetrics();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Supabase Monitor] ${operation} - Queries: ${this.metrics.queries}, Data: ${this.formatBytes(this.metrics.dataTransferred)}`);
      }
    } catch (error) {
      // Silently handle monitoring errors to prevent app disruption
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase monitoring error:', error);
      }
    }
  }

  /**
   * Track real-time connection
   */
  trackRealtimeConnection() {
    try {
      this.resetIfNeeded();
      this.metrics.realtimeConnections++;
      // Real-time connections typically use more bandwidth
      this.metrics.dataTransferred += 5120; // Estimate 5KB per connection
      this.saveMetrics();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Supabase Monitor] Real-time connection - Total: ${this.metrics.realtimeConnections}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase monitoring error:', error);
      }
    }
  }

  /**
   * Get current usage metrics
   */
  getMetrics(): UsageMetrics & { estimatedMonthlyUsage: number; percentOfLimit: number } {
    this.resetIfNeeded();
    const estimatedMonthlyUsage = this.metrics.dataTransferred * 30; // Rough monthly estimate
    const percentOfLimit = (estimatedMonthlyUsage / this.FREE_TIER_MONTHLY_LIMIT) * 100;
    
    return {
      ...this.metrics,
      estimatedMonthlyUsage,
      percentOfLimit
    };
  }

  /**
   * Check if approaching limits
   */
  isApproachingLimit(): boolean {
    const metrics = this.getMetrics();
    return metrics.percentOfLimit > 80;
  }

  /**
   * Get usage summary for debugging
   */
  getUsageSummary(): string {
    const metrics = this.getMetrics();
    return `
Supabase Usage (Today):
- Queries: ${metrics.queries}
- Data transferred: ${this.formatBytes(metrics.dataTransferred)}
- Real-time connections: ${metrics.realtimeConnections}
- Estimated monthly: ${this.formatBytes(metrics.estimatedMonthlyUsage)} (${metrics.percentOfLimit.toFixed(1)}% of 2GB limit)
    `.trim();
  }

  private loadMetrics() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('supabase_usage_metrics');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Reset if data is from a previous day
        const daysSince = (Date.now() - parsed.lastReset) / this.DAILY_RESET_INTERVAL;
        if (daysSince >= 1) {
          this.resetMetrics();
        } else {
          this.metrics = parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load usage metrics:', error);
    }
  }

  private saveMetrics() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('supabase_usage_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save usage metrics:', error);
    }
  }

  private resetIfNeeded() {
    const daysSince = (Date.now() - this.metrics.lastReset) / this.DAILY_RESET_INTERVAL;
    if (daysSince >= 1) {
      this.resetMetrics();
    }
  }

  private resetMetrics() {
    this.metrics = {
      queries: 0,
      dataTransferred: 0,
      realtimeConnections: 0,
      lastReset: Date.now()
    };
    this.saveMetrics();
  }

  private setupPeriodicReset() {
    if (typeof window === 'undefined') return;
    
    // Check for reset every hour
    setInterval(() => {
      this.resetIfNeeded();
    }, 60 * 60 * 1000);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const usageMonitor = new SupabaseUsageMonitor();

// Helper function to wrap Supabase queries with monitoring
export function monitorSupabaseQuery<T>(
  operation: string,
  queryPromise: Promise<T>,
  estimatedSize = 1024
): Promise<T> {
  usageMonitor.trackQuery(operation, estimatedSize);
  return queryPromise;
}

export default SupabaseUsageMonitor;
