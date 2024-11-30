import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { List } from 'lucide-react';
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
                <BreadcrumbPage href="/list">List</BreadcrumbPage>
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
          <List className="mr-3 text-blue-500" />
          Lists and Product Management
        </h1>
        <Separator className="mb-6" />

        {/* Subroutes Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-md bg-gray-50 p-6 shadow-sm hover:shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              Create New List
            </h2>
            <p className="mt-2 text-gray-600">
              Use the{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5">/list/new</code>{' '}
              route to create and customize a new product list.
            </p>
            <ul className="mt-4 list-inside list-disc text-sm text-gray-700">
              <li>Add products manually or by search</li>
              <li>Assign categories for better organization</li>
              <li>Save lists for future use</li>
            </ul>
            <Link
              href="/list/new"
              className="mt-4 inline-block rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              Go to New List
            </Link>
          </div>

          <div className="rounded-md bg-gray-50 p-6 shadow-sm hover:shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              View All Lists
            </h2>
            <p className="mt-2 text-gray-600">
              Access the{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5">/list/all</code>{' '}
              route to view and manage all your saved lists.
            </p>
            <ul className="mt-4 list-inside list-disc text-sm text-gray-700">
              <li>See a complete overview of your lists</li>
              <li>Edit or delete lists as needed</li>
              <li>Track the number of items in each list</li>
            </ul>
            <Link
              href="/list/all"
              className="mt-4 inline-block rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              Go to All Lists
            </Link>
          </div>

          <div className="rounded-md bg-gray-50 p-6 shadow-sm hover:shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              Share Your Lists
            </h2>
            <p className="mt-2 text-gray-600">
              Navigate to{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5">
                /list/share
              </code>{' '}
              to share lists with others easily.
            </p>
            <ul className="mt-4 list-inside list-disc text-sm text-gray-700">
              <li>Generate shareable links for lists</li>
              <li>Collaborate with team members</li>
              <li>Control access permissions</li>
            </ul>
            <Link
              href="/list/share"
              className="mt-4 inline-block rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              Go to Share Lists
            </Link>
          </div>
        </div>

        {/* Scheduler Section */}
        <div className="mt-8 rounded-md bg-gray-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Schedules to Lists
          </h2>
          <p className="mt-4 text-gray-600">
            Automate reminders and notifications by adding schedules to your
            lists. Stay on top of your tasks effortlessly.
          </p>
          <ul className="mt-4 list-inside list-disc text-sm text-gray-700">
            <li>Set reminders for reviewing lists</li>
            <li>Schedule alerts for price drops or updates</li>
            <li>Organize lists based on deadlines</li>
          </ul>
          <Link
            href="/list/schedule"
            className="mt-4 inline-block rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Manage Schedules
          </Link>
        </div>
      </div>
    </>
  );
}
