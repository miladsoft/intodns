import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  domain: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export default function ErrorDisplay({ error, domain, onRetry, isRetrying }: ErrorDisplayProps) {
  const isCorsError = error.toLowerCase().includes('cors') || 
                     error.toLowerCase().includes('network') ||
                     error.toLowerCase().includes('fetch');

  const isRateLimited = error.toLowerCase().includes('rate') || 
                       error.toLowerCase().includes('limit') ||
                       error.toLowerCase().includes('429');

  const getErrorType = () => {
    if (isCorsError) return 'cors';
    if (isRateLimited) return 'rate-limit';
    return 'general';
  };

  const getErrorMessage = () => {
    const errorType = getErrorType();
    
    switch (errorType) {
      case 'cors':
        return 'Unable to fetch DNS data due to browser security restrictions. This is common with third-party DNS APIs.';
      case 'rate-limit':
        return 'Rate limit exceeded. Please wait a moment before trying again.';
      default:
        return error || 'An unexpected error occurred while fetching DNS information.';
    }
  };

  const getAlternativeOptions = () => {
    const alternatives = [
      {
        name: 'DNS Checker',
        url: `https://dnschecker.org/#A/${encodeURIComponent(domain)}`,
        description: 'Check DNS propagation worldwide'
      },
      {
        name: 'What\'s My DNS',
        url: `https://www.whatsmydns.net/#A/${encodeURIComponent(domain)}`,
        description: 'Global DNS propagation checker'
      },
      {
        name: 'MX Toolbox',
        url: `https://mxtoolbox.com/SuperTool.aspx?action=a&run=toolpage&host=${encodeURIComponent(domain)}`,
        description: 'Comprehensive DNS and network tools'
      },
      {
        name: 'Whois Lookup',
        url: `https://who.is/whois/${encodeURIComponent(domain)}`,
        description: 'Domain registration information'
      }
    ];

    return alternatives;
  };

  return (
    <Card className="border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
          <AlertTriangle className="h-5 w-5" />
          DNS Lookup Error
        </CardTitle>
        <CardDescription>
          {getErrorMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {onRetry && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onRetry}
              disabled={isRetrying}
              size="sm"
            >
              {isRetrying ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Try Again
            </Button>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
            Alternative DNS Tools
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getAlternativeOptions().map((option, index) => (
              <a
                key={index}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{option.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{option.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> Due to browser security restrictions (CORS), some DNS queries may fail. 
            The alternative tools above can provide the DNS information you need.
          </p>
        </div>

        {getErrorType() === 'cors' && (
          <div className="mt-3">
            <Badge variant="outline" className="text-xs">
              Error Type: CORS Restriction
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
