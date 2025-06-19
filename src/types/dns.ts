export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
  priority?: number;
  ip?: string;
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

export interface SOARecord {
  primaryNameserver: string;
  hostmasterEmail: string;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minimumTTL: number;
}

export interface DNSTest {
  category: 'Parent' | 'NS' | 'SOA' | 'MX' | 'WWW' | 'Mail' | 'General';
  status: 'Pass' | 'Warn' | 'Error' | 'Info';
  name: string;
  description: string;
  details?: string;
  recommendations?: string[];
}

export interface NameserverInfo {
  hostname: string;
  ips: string[];
  hasGlue: boolean;
  isAuthoritative: boolean;
  allowsRecursion: boolean;
  respondsToTCP: boolean;
  subnet?: string;
  autonomousSystem?: string;
}

export interface DNSAnalysis {
  parentServers: {
    nameservers: NameserverInfo[];
    glueRecords: { [key: string]: string[] };
    tests: DNSTest[];
  };
  nameserverTests: {
    nameservers: NameserverInfo[];
    tests: DNSTest[];
  };
  soaAnalysis?: {
    record: SOARecord;
    tests: DNSTest[];
  };
  mxAnalysis: {
    records: DNSRecord[];
    tests: DNSTest[];
  };
  wwwAnalysis: {
    aRecords: DNSRecord[];
    cnameChain: string[];
    tests: DNSTest[];
  };
  generalTests: DNSTest[];
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
  analysis?: DNSAnalysis;
  status: 'loading' | 'success' | 'error';
  error?: string;
  processingTime?: number;
}
