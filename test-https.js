const testDomains = [
  'google.com',      // Should have HTTPS
  'example.com',     // Should have HTTPS  
  'httpbin.org',     // Should have HTTPS
  'httpforever.com', // Should have HTTP but might not have HTTPS
];

async function testHTTPSAvailability() {
  console.log('Testing HTTPS availability for various domains...\n');
  
  for (const domain of testDomains) {
    console.log(`Testing ${domain}:`);
    
    try {
      // Test HTTPS
      const httpsStart = Date.now();
      const httpsResponse = await fetch(`https://${domain}`, { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      const httpsTime = Date.now() - httpsStart;
      console.log(`  ✅ HTTPS: Available (${httpsTime}ms)`);
    } catch (error) {
      console.log(`  ❌ HTTPS: Not available (${error.message})`);
    }
    
    try {
      // Test HTTP
      const httpStart = Date.now();
      const httpResponse = await fetch(`http://${domain}`, { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      const httpTime = Date.now() - httpStart;
      console.log(`  ✅ HTTP: Available (${httpTime}ms)`);
    } catch (error) {
      console.log(`  ❌ HTTP: Not available (${error.message})`);
    }
    
    console.log('');
  }
}

// Note: This script is for reference only
// The actual implementation is in src/services/dns.ts
console.log('Test script created. Check src/services/dns.ts for the actual implementation.');
