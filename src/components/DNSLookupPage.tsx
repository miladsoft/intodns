import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Globe, Shield, Server, Mail, FileText, CheckCircle, XCircle } from 'lucide-react';
import { DNSService } from '@/services/dns';
import { cleanDomainInput, validateDomain } from '@/lib/domain-utils';
import DNSPropagation from '@/components/DNSPropagation';
import ErrorDisplay from '@/components/ErrorDisplay';
import type { DNSLookupResult, DNSRecord } from '@/types/dns';

export default function DNSLookupPage() {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  
  const [lookupResult, setLookupResult] = useState<DNSLookupResult | null>(null);
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [searchDomain, setSearchDomain] = useState(domain || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (domain) {
      performLookup(domain);
    }
  }, [domain]);

  const performLookup = async (targetDomain: string) => {
    setIsLoading(true);
    try {
      const [dnsResult, healthResult] = await Promise.all([
        DNSService.lookupDNS(targetDomain),
        DNSService.performHealthCheck(targetDomain)
      ]);
      
      setLookupResult(dnsResult);
      setHealthCheck(healthResult);
    } catch (error) {
      console.error('Lookup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDomain.trim()) return;
    
    const cleanDomain = cleanDomainInput(searchDomain);
    
    if (!validateDomain(cleanDomain)) {
      alert('Please enter a valid domain name');
      return;
    }
    
    navigate(`/${cleanDomain}`);
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'A':
      case 'AAAA':
        return Globe;
      case 'MX':
        return Mail;
      case 'NS':
        return Server;
      case 'TXT':
        return FileText;
      default:
        return FileText;
    }
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'success' : 'destructive';
  };

  const formatTTL = (ttl?: number) => {
    if (!ttl) return 'N/A';
    if (ttl < 60) return `${ttl}s`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}h`;
    return `${Math.floor(ttl / 86400)}d`;
  };
  if (!domain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Domain Not Found</CardTitle>
            <CardDescription>Please enter a valid domain name</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="ml-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-2"
            >
              <ArrowLeft className="ml-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              DNS Analysis: {domain}
            </h1>
          </div>
          
          {/* New Search */}          <form onSubmit={handleNewSearch} className="flex gap-2">
            <Input
              placeholder="New domain..."
              value={searchDomain}
              onChange={(e) => setSearchDomain(e.target.value)}
              className="w-64"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Analyzing DNS information...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Health Check */}
            {healthCheck && (
              <Card>                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Server Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {healthCheck.isOnline ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-500" />
                        )}
                      </div>                      <p className="text-sm text-gray-600 dark:text-gray-300">Overall Status</p>
                      <Badge variant={getStatusColor(healthCheck.isOnline)}>
                        {healthCheck.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {healthCheck.httpStatus}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">HTTP Status</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {healthCheck.httpsStatus}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">HTTPS Status</p>
                    </div>                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {healthCheck.responseTime}ms
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Response Time</p>
                    </div>
                    {healthCheck.httpsAvailable !== undefined && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {healthCheck.httpsAvailable ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">HTTPS Available</p>
                        <Badge variant={healthCheck.httpsAvailable ? 'success' : 'destructive'}>
                          {healthCheck.httpsAvailable ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  {healthCheck.lastChecked && (
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        Last checked: {new Date(healthCheck.lastChecked).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* DNS Records */}
            {lookupResult && (
              <div className="grid gap-6">
                {Object.entries(lookupResult.records).map(([recordType, records]) => {
                  if (records.length === 0) return null;
                  
                  const IconComponent = getRecordIcon(recordType);
                  
                  return (
                    <Card key={recordType}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5" />
                          {recordType} Records
                        </CardTitle>                        <CardDescription>
                          {records.length} records found
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {records.map((record: DNSRecord, index: number) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">Value</p>
                                  <p className="font-mono text-sm break-all">{record.value}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">TTL</p>
                                  <Badge variant="outline">{formatTTL(record.ttl)}</Badge>
                                </div>
                                {record.priority && (
                                  <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Priority</p>
                                    <Badge variant="secondary">{record.priority}</Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Whois Information */}
            {lookupResult?.whois && (
              <Card>                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Whois Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Registrar</p>
                        <p className="font-semibold">{lookupResult.whois.registrar || 'N/A'}</p>
                      </div>                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Registration Date</p>
                        <p className="font-semibold">{lookupResult.whois.registrationDate || 'N/A'}</p>
                      </div>                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Expiration Date</p>
                        <p className="font-semibold">{lookupResult.whois.expirationDate || 'N/A'}</p>
                      </div>
                      {lookupResult.whois.updateDate && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Last Updated</p>
                          <p className="font-semibold">{lookupResult.whois.updateDate}</p>
                        </div>
                      )}
                      {lookupResult.whois.registrant?.email && lookupResult.whois.registrant.email !== 'Private' && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Registrant Email</p>
                          <p className="font-semibold font-mono text-sm">{lookupResult.whois.registrant.email}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {lookupResult.whois.nameServers && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Name Servers</p>
                          <div className="space-y-1">
                            {lookupResult.whois.nameServers.map((ns, index) => (                              <Badge key={index} variant="outline" className="ml-2">
                                {ns}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {lookupResult.whois.status && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Status</p>
                          <div className="space-y-1">
                            {lookupResult.whois.status.map((status, index) => (                              <Badge key={index} variant="secondary" className="ml-2">
                                {status}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>            )}

            {/* DNS Propagation Check */}
            {lookupResult?.status === 'success' && (
              <DNSPropagation domain={domain} recordType="A" />
            )}            {lookupResult?.status === 'error' && (
              <ErrorDisplay 
                error={lookupResult.error || 'Unknown error occurred'}
                domain={domain}
                onRetry={() => performLookup(domain)}
                isRetrying={isLoading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
