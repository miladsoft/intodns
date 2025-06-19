import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw } from 'lucide-react';
import { DNSService } from '@/services/dns';

interface DNSPropagationProps {
  domain: string;
  recordType?: string;
}

export default function DNSPropagation({ domain, recordType = 'A' }: DNSPropagationProps) {
  const [propagationData, setPropagationData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const checkPropagation = async () => {
    setIsLoading(true);
    try {
      const data = await DNSService.checkDNSPropagation(domain, recordType);
      setPropagationData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to check DNS propagation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPropagation();
  }, [domain, recordType]);

  const getConsistencyStatus = () => {
    if (propagationData.length === 0) return 'unknown';
    
    const allRecords = propagationData.flatMap(provider => provider.records);
    if (allRecords.length === 0) return 'no-records';
    
    // Check if all providers return the same records
    const firstValues = propagationData[0]?.records?.map((r: any) => r.value) || [];
    const allConsistent = propagationData.every(provider => {
      const values = provider.records?.map((r: any) => r.value) || [];
      return JSON.stringify(values.sort()) === JSON.stringify(firstValues.sort());
    });
    
    return allConsistent ? 'consistent' : 'inconsistent';
  };

  const consistencyStatus = getConsistencyStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            DNS Propagation Check
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={checkPropagation}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        <CardDescription>
          Checking {recordType} records across different DNS providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {consistencyStatus === 'consistent' && (
          <div className="mb-4">
            <Badge variant="success" className="mb-2">
              ✓ DNS records are consistent across all providers
            </Badge>
          </div>
        )}
        
        {consistencyStatus === 'inconsistent' && (
          <div className="mb-4">
            <Badge variant="destructive" className="mb-2">
              ⚠ DNS records are inconsistent across providers
            </Badge>
          </div>
        )}

        <div className="space-y-4">
          {propagationData.map((provider, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg">{provider.provider}</h4>
                <Badge variant="outline">
                  {provider.records?.length || 0} record{provider.records?.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {provider.records && provider.records.length > 0 ? (
                <div className="space-y-2">
                  {provider.records.map((record: any, recordIndex: number) => (
                    <div key={recordIndex} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                      <span className="font-mono text-sm">{record.value}</span>
                      <Badge variant="secondary">TTL: {record.ttl}s</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No records found</p>
              )}
            </div>
          ))}
        </div>

        {lastUpdated && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
