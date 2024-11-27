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
  Bell,
  Brain,
  Calendar,
  Clock,
  FileText,
  Layout,
  MessageSquare,
  Presentation,
  Timer,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Layout className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">ProductivityHub</span>
          </div>

          <div className="hidden items-center space-x-6 md:flex">
            <Link
              href="#features"
              className="text-zinc-600 transition hover:text-blue-600"
            >
              Features
            </Link>
            <Link
              href="#managers"
              className="text-zinc-600 transition hover:text-blue-600"
            >
              For Managers
            </Link>
            <Link
              href="#employees"
              className="text-zinc-600 transition hover:text-blue-600"
            >
              For Employees
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
              Transform Your Team&apos;s Productivity
            </h1>
            <p className="animate-fade-in-delay-1 text-xl text-zinc-600">
              An all-in-one platform for team collaboration, task management,
              and employee well-being.
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
              alt="Platform Preview"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Basic Features */}
      <section id="features" className="mx-auto bg-zinc-100 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Basic Features
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <MessageSquare className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle>Team Communication</CardTitle>
                <CardDescription>
                  Slack/Discord-like servers for seamless team collaboration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <FileText className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle>Live Document Sharing</CardTitle>
                <CardDescription>
                  Real-time collaborative document editing and sharing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <Presentation className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle>Presentation Tools</CardTitle>
                <CardDescription>
                  Create and collaborate on presentations in real-time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Manager Features */}
      <section id="managers" className="mx-auto max-w-5xl py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Manager Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <Bell className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle>Advanced Notifications</CardTitle>
                <CardDescription>
                  Multi-channel notifications system including push, web, and
                  email alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Employee activity tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Scheduled notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <Brain className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle>AI-Powered Task Management</CardTitle>
                <CardDescription>
                  Smart task allocation based on employee performance and
                  availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Workload optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-blue-600" />
                    <span>Performance analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Employee Features */}
      <section id="employees" className="mx-auto bg-zinc-100 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Employee Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <Timer className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle>Productivity Tools</CardTitle>
                <CardDescription>
                  Pomodoro timer and workflow management tools to boost
                  productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Customizable time tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-blue-600" />
                    <span>Task organization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="transition hover:shadow-lg">
              <CardHeader>
                <Brain className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle>Mental Health Support</CardTitle>
                <CardDescription>
                  AI-driven well-being monitoring and support system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span>Smart break reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Wellness resources</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Transform Your Workplace?
          </h2>
          <p className="mb-8 text-xl text-zinc-600">
            Join thousands of teams already using ProductivityHub
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
