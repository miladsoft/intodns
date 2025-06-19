# DNS Lookup Tool

Complete DNS and Whois analysis tool for internet domains

## Features

- 🔍 **Complete DNS Analysis**: View all DNS records including A, AAAA, MX, NS, TXT, CNAME, and SOA
- 📋 **Whois Information**: Get complete domain registration details, expiration dates, and owner information
- ⚡ **Real-time Analysis**: Live domain status checking and server response time monitoring
- 🎨 **Modern UI**: Beautiful and user-friendly interface with dark mode support
- 📱 **Responsive**: Compatible with all devices and screen sizes

## How to Use

1. Enter the domain name you want to analyze on the homepage
2. Click the "Analyze" button
3. View complete DNS and Whois results

## Technologies Used

- **React 19** - UI library
- **TypeScript** - For type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - CSS framework
- **Shadcn/ui** - Ready-to-use UI components
- **React Router** - Routing
- **Lucide React** - Icons

## Project Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Routes

- `/` - Homepage
- `/:domain` - DNS analysis results page

## Note

This project currently uses mock data for demonstration. For production use, you need to implement real DNS and Whois APIs.

## License

MIT License