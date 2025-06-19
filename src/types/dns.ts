export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
  priority?: number;
}

export interface WhoisData {
  domain: string;
  registrar?: string;
  registrationDate?: string;
  expirationDate?: string;
  updateDate?: string;
  nameServers?: string[];
  status?: string[];
  registrant?: {
    name?: string;
    organization?: string;
    country?: string;
    email?: string;
  };
}

export interface DNSLookupResult {
  domain: string;
  records: {
    A: DNSRecord[];
    AAAA: DNSRecord[];
    MX: DNSRecord[];
    NS: DNSRecord[];
    TXT: DNSRecord[];
    CNAME: DNSRecord[];
    SOA: DNSRecord[];
  };
  whois?: WhoisData;
  status: 'loading' | 'success' | 'error';
  error?: string;
}
