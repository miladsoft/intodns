import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Globe, Shield, Clock, AlertCircle } from 'lucide-react';
import { validateDomain, cleanDomainInput } from '@/lib/domain-utils';

export default function HomePage() {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setIsLoading(true);
    setError('');
    
    // Clean domain input
    const cleanDomain = cleanDomainInput(domain);
      // Validate domain
    if (!validateDomain(cleanDomain)) {
      setError('Please enter a valid domain name');
      setIsLoading(false);
      return;
    }
    
    // Navigate to DNS lookup page
    navigate(`/${cleanDomain}`);
    
    setIsLoading(false);
  };
  const features = [
    {
      icon: Globe,
      title: 'DNS Records',
      description: 'View all DNS records including A, AAAA, MX, NS, TXT, CNAME, and SOA records'
    },
    {
      icon: Shield,
      title: 'Whois Information', 
      description: 'Complete domain registration details, expiration dates, and owner information'
    },
    {
      icon: Clock,
      title: 'Real-time Analysis',
      description: 'Live domain status analysis and server response time monitoring'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            DNS Lookup Tool
          </h1>          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Complete DNS and Whois analysis for internet domains
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card>            <CardHeader>
              <CardTitle className="text-center">Enter your domain</CardTitle>
              <CardDescription className="text-center">
                Enter the full URL or domain name
              </CardDescription>
            </CardHeader><CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">                    <Input
                      type="text"
                      placeholder="example.com or https://example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isLoading || !domain.trim()}
                    className="h-12 px-8"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (                      <>
                        <Search className="ml-2 h-5 w-5" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <feature.icon className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>        {/* Examples */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Try these examples
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['google.com', 'github.com', 'stackoverflow.com', 'cloudflare.com'].map((example) => (
              <Button
                key={example}
                variant="outline"
                onClick={() => setDomain(example)}
                className="text-sm"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
