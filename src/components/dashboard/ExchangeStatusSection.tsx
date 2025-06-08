import React from 'react';
import Card from '@/components/ui/Card';

export interface ExchangeStatus {
  id: string;
  title: string;
  participants: string[];
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'rejected';
  lastUpdated: string; // Human-readable time
  timestamp: string; // ISO timestamp for sorting
  progress: number; // 0-100
  description?: string;
  skillOffered?: string;
  skillRequested?: string;
  nextStep?: string;
}

interface ExchangeStatusItemProps {
  exchange: ExchangeStatus;
  onAction?: (action: string, id: string) => void;
}

export const ExchangeStatusItem: React.FC<ExchangeStatusItemProps> = ({ exchange, onAction }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'In Progress';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getActionButtons = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <>
            <button 
              onClick={() => onAction && onAction('message', exchange.id)}
              className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded hover:bg-primary-100"
            >
              Message
            </button>
            <button 
              onClick={() => onAction && onAction('complete', exchange.id)}
              className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100"
            >
              Mark Complete
            </button>
          </>
        );
      case 'pending':
        return (
          <>
            <button 
              onClick={() => onAction && onAction('accept', exchange.id)}
              className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100"
            >
              Accept
            </button>
            <button 
              onClick={() => onAction && onAction('reject', exchange.id)}
              className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100"
            >
              Decline
            </button>
          </>
        );
      case 'completed':
        return (
          <button 
            onClick={() => onAction && onAction('review', exchange.id)}
            className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded hover:bg-primary-100"
          >
            Leave Review
          </button>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="border-b border-gray-100 pb-4">
      <div className="flex justify-between mb-1">
        <h4 className="font-medium">{exchange.title}</h4>
        <span className="text-sm text-gray-500">Updated: {exchange.lastUpdated}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getStatusColor(exchange.status)}`} 
            style={{ width: `${exchange.progress}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium">{exchange.progress}%</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(exchange.status)}`}></span>
          <span className="text-sm font-medium">{getStatusText(exchange.status)}</span>
        </div>
        {onAction && (
          <div className="flex space-x-2">
            {getActionButtons(exchange.status)}
          </div>
        )}
      </div>
    </div>
  );
};

export interface ExchangeStatusSectionProps {
  exchanges: ExchangeStatus[];
  loading?: boolean;
  emptyMessage?: string;
  showViewAll?: boolean;
  viewAllUrl?: string;
  limit?: number;
  onAction?: (action: string, id: string) => void;
  className?: string;
}

const ExchangeStatusSection: React.FC<ExchangeStatusSectionProps> = ({
  exchanges,
  loading = false,
  emptyMessage = "No exchanges found",
  showViewAll = true,
  viewAllUrl = "/exchanges",
  limit,
  onAction,
  className,
}) => {
  // Apply limit if specified
  const displayedExchanges = limit ? exchanges.slice(0, limit) : exchanges;

  return (
    <Card className={`p-6 ${className || ''}`}>
      <h2 className="text-xl font-bold mb-4">Exchange Status</h2>
      
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : displayedExchanges.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="space-y-4">
          {displayedExchanges.map((exchange) => (
            <ExchangeStatusItem 
              key={exchange.id} 
              exchange={exchange}
              onAction={onAction}
            />
          ))}
        </div>
      )}

      {showViewAll && exchanges.length > 0 && (
        <a 
          href={viewAllUrl}
          className="text-primary-600 font-medium mt-4 hover:text-primary-700 transition-colors inline-block"
        >
          Manage all exchanges
        </a>
      )}
    </Card>
  );
};

export default ExchangeStatusSection;
