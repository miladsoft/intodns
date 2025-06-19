export const validateDomain = (domain: string): boolean => {
  if (!domain || domain.length === 0) return false;
  
  // Clean the domain first
  let cleanDomain = domain.trim().toLowerCase();
  cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
  cleanDomain = cleanDomain.replace(/^www\./, '');
  cleanDomain = cleanDomain.replace(/\/$/, '');
  
  // Basic domain regex validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/;
  
  // Check if it contains at least one dot (for TLD)
  if (!cleanDomain.includes('.')) return false;
  
  // Check length
  if (cleanDomain.length > 253) return false;
  
  // Check each label
  const labels = cleanDomain.split('.');
  for (const label of labels) {
    if (label.length === 0 || label.length > 63) return false;
    if (!domainRegex.test(label)) return false;
  }
  
  return true;
};

export const cleanDomainInput = (input: string): string => {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.replace(/\/$/, '');
  domain = domain.replace(/\/.*$/, ''); // Remove path
  return domain;
};

export const formatDomainForDisplay = (domain: string): string => {
  return domain.toLowerCase();
};
