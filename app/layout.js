import './globals.css';

export const metadata = {
  title: 'Clean Trails',
  description: 'An RC Technovate 2.0 Project',
  icons: './favicon.ico',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
