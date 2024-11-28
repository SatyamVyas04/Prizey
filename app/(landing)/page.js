/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  AlertTriangle,
  BarChart2,
  Clock,
  DollarSign,
  Globe,
  Percent,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Prizey</span>
          </div>

          <div className="hidden items-center space-x-6 md:flex">
            <Link
              href="#features"
              className="text-zinc-600 transition hover:text-green-600"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-zinc-600 transition hover:text-green-600"
            >
              How It Works
            </Link>
            <Link
              href="#platforms"
              className="text-zinc-600 transition hover:text-green-600"
            >
              Supported Platforms
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="ml-4">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl pb-16 pt-32">
        <div className="container mx-auto grid items-center gap-8 px-4 md:grid-cols-2">
          <div className="space-y-6">
            <h1 className="animate-fade-in text-5xl font-bold leading-tight">
              Smart Price Tracking, Smarter Shopping
            </h1>
            <p className="animate-fade-in-delay-1 text-xl text-zinc-600">
              Never miss a deal. Track prices across multiple platforms and save
              money effortlessly.
            </p>
            <div className="animate-fade-in-delay-2 space-x-4">
              <Button size="lg">Start Free Trial</Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="animate-float relative">
            <img
              src="https://placehold.co/600x400"
              alt="Price Tracking Dashboard"
              className="max-w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Basic Features */}
      <section id="features" className="mx-auto bg-zinc-100 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Core Features
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <TrendingDown className="mb-2 h-8 w-8 text-green-600" />
                <CardTitle>Price Drop Alerts</CardTitle>
                <CardDescription>
                  Get instant notifications when prices drop on your tracked
                  items
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <Search className="mb-2 h-8 w-8 text-green-600" />
                <CardTitle>Multi-Platform Tracking</CardTitle>
                <CardDescription>
                  Track prices across Amazon, eBay, Walmart, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <BarChart2 className="mb-2 h-8 w-8 text-green-600" />
                <CardTitle>Price History Analytics</CardTitle>
                <CardDescription>
                  Visualize price trends and make informed purchasing decisions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-5xl py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            How Prizey Works
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <Globe className="mb-2 h-8 w-8 text-green-600" />
                <CardTitle>Universal Product Tracking</CardTitle>
                <CardDescription>
                  Add products from any e-commerce platform with a simple URL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span>Real-time price updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Community-driven insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <AlertTriangle className="mb-2 h-8 w-8 text-green-600" />
                <CardTitle>Custom Price Alerts</CardTitle>
                <CardDescription>
                  Set personalized price thresholds and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-green-600" />
                    <span>Percentage-based alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Price prediction insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section id="platforms" className="mx-auto bg-zinc-100 py-16">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold">
            Supported E-commerce Platforms
          </h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale">
            <p>Amazon</p>
            <p>eBay</p>
            <p>Walmart</p>
            <p>BestBuy</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Start Saving Money Today</h2>
          <p className="mb-8 text-xl text-zinc-600">
            Join thousands of smart shoppers tracking prices and finding the
            best deals
          </p>
          <Button size="lg" className="animate-bounce">
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
