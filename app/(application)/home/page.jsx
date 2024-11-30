import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ShoppingCart,
  Bell,
  Share2,
  TrendingDown,
  ListChecks,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'next-view-transitions';

export default function PrizeyHomePage() {
  const features = [
    {
      title: 'Product Search',
      description:
        'Comprehensive tracking across multiple online retailers with precision filtering.',
      icon: ShoppingCart,
      color: 'text-indigo-600',
      background: 'bg-indigo-50',
    },
    {
      title: 'Price Monitoring',
      description:
        'Advanced alerts and notifications for strategic purchasing decisions.',
      icon: Bell,
      color: 'text-green-600',
      background: 'bg-green-50',
    },
    {
      title: 'List Management',
      description:
        'Streamlined product collection creation, collaboration, and sharing.',
      icon: ListChecks,
      color: 'text-purple-600',
      background: 'bg-purple-50',
    },
  ];

  const quickStats = [
    {
      title: 'Products Tracked',
      value: '1,245',
      icon: TrendingDown,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Active Alerts',
      value: '15',
      icon: Bell,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Shared Lists',
      value: '2',
      icon: Share2,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Users Online',
      value: '128',
      icon: Bell,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Price Drops Today',
      value: '32',
      icon: TrendingDown,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'New Users Joined',
      value: '12',
      icon: Share2,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Total Searches',
      value: '5,230',
      icon: ShoppingCart,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Favorites Saved',
      value: '452',
      icon: ListChecks,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Coupons Available',
      value: '75',
      icon: Bell,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Discount Notifications Sent',
      value: '540',
      icon: TrendingDown,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Scheduled Alerts',
      value: '23',
      icon: ListChecks,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
    {
      title: 'Wishlist Items',
      value: '84',
      icon: ShoppingCart,
      color: 'text-gray-800',
      background: 'bg-gray-100',
    },
  ];

  const actions = [
    { title: 'Home', url: '/home' },
    { title: 'New Search', url: '/search/new' },
    { title: 'Past Searches', url: '/search/past' },
    { title: 'View All Lists', url: '/list/all' },
    { title: 'Create New List', url: '/list/new' },
    { title: 'Share List', url: '/list/share' },
    { title: 'View Schedules', url: '/schedule/view' },
    { title: 'Set Alerts', url: '/alert' },
    { title: 'Profile', url: '/profile' },
  ];

  return (
    <div className="flex min-h-screen flex-col rounded-xl bg-gray-50">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage href="/home">Home</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 flex-col gap-8 px-4 py-8">
        {/* Dashboard Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome to Prizey
            </h2>
            <p className="mt-2 text-gray-600">
              Optimize your shopping strategy with advanced price tracking.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 rounded-lg p-4 ${stat.background} ${stat.color}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-lg font-semibold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Quick Actions
            </h3>
            <div className="mt-4 h-full space-y-2 overflow-scroll">
              {actions.map((action, index) => (
                <Link
                  key={index}
                  href={action.url}
                  className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  {action.title}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`transform rounded-lg border-none shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${feature.background}`}
            >
              <CardHeader className="flex items-center space-x-4">
                <div className="rounded-full bg-white p-3 shadow-sm">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
