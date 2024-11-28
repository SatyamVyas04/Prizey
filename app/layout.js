import './globals.css';

export const metadata = {
  title: 'Prizey - eCommerce Price Tracker',
  description:
    'Prizey is an integrated eCommerce price tracking system designed for online buyers and shoppers. It allows users to manage commodities, track price changes, compare products, and gain valuable insights into market trends. Developed as a comprehensive solution to enhance user engagement and streamline price monitoring.',
  icons: '/favicon.ico',
  keywords: [
    'Price Tracking',
    'eCommerce',
    'Online Shopping',
    'Price Comparison',
    'Market Trends',
    'Analytics',
    'Product Alerts',
    'Price History',
  ],
  author: 'Prizey Development Team',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="author" content={metadata.author} />
        <link rel="icon" href={metadata.icons} />
      </head>
      <body>{children}</body>
    </html>
  );
}
