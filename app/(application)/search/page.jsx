import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';

export default function Page() {
  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage href="/search">Search</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto mt-6 px-6">
        {/* Page Title */}
        <h1 className="mb-6 flex items-center text-3xl font-bold text-gray-800">
          <Search className="mr-3 text-blue-500" />
          Product Search
        </h1>
        <Separator className="mb-6" />

        {/* Features Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-6 shadow-sm hover:shadow-md">
            <h2 className="mb-3 text-xl font-semibold text-gray-800">
              /new Page
            </h2>
            <p className="text-gray-600">
              The <code className="rounded bg-gray-100 px-1 py-0.5">/new</code>{' '}
              page allows you to search for product categories directly on
              Amazon.
            </p>
            <ul className="mt-4 list-inside list-disc text-sm text-gray-700">
              <li>Browse Amazon categories in real-time</li>
              <li>Find the latest products</li>
              <li>Explore diverse product ranges</li>
            </ul>
          </div>

          <div className="rounded-lg bg-gray-50 p-6 shadow-sm hover:shadow-md">
            <h2 className="mb-3 text-xl font-semibold text-gray-800">
              /past Page
            </h2>
            <p className="text-gray-600">
              The <code className="rounded bg-gray-100 px-1 py-0.5">/past</code>{' '}
              page displays all previously scanned products.
            </p>
            <ul className="mt-4 list-inside list-disc text-sm text-gray-700">
              <li>View all previously scanned products</li>
              <li>Add products to your personal lists</li>
              <li>Track product history</li>
            </ul>
          </div>
        </div>

        {/* Technical Overview */}
        <div className="mt-8 rounded-lg bg-gray-50 p-6 shadow-sm hover:shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Web Scraping Technology
          </h2>
          <div className="flex items-center">
            <Image
              src="https://styles.redditmedia.com/t5_2mfx56/styles/communityIcon_ffqh9ffodyv41.png"
              alt="Apify Logo"
              width={50}
              height={50}
              className="mr-4 rounded-full"
            />
            <p className="text-gray-600">
              We utilize the <strong>Apify Junglee Web Scraper</strong> to
              efficiently retrieve product information from Amazon.
            </p>
          </div>
          <ul className="mt-4 list-inside list-disc text-sm text-gray-700">
            <li>Robust and reliable web scraping</li>
            <li>Real-time product data retrieval</li>
            <li>Compliant with web scraping best practices</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="mt-8 flex flex-col items-center rounded-lg bg-blue-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            Ready to Optimize Your Search Experience?
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Explore new and past searches, track product prices, and take
            advantage of our robust scraping technology.
          </p>
          <div className="mt-4 flex space-x-4">
            <Link
              href="/search/new"
              className="rounded-md bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600"
            >
              Start New Search
            </Link>
            <Link
              href="/search/past"
              className="rounded-md bg-gray-100 px-4 py-2 text-gray-800 transition-all hover:bg-gray-200"
            >
              View Past Searches
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
