'use client';

import * as React from 'react';
import {
  LucideHome,
  DollarSign,
  BookOpen,
  Frame,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Calendar,
} from 'lucide-react';

import { NavMain } from '@/components/application/nav-main';
import { NavProjects } from '@/components/application/nav-projects';
import { NavSecondary } from '@/components/application/nav-secondary';
import { NavUser } from '@/components/application/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

const data = {
  user: {
    name: 'Prizey User',
    email: 'user@Prizeyapp.com',
    avatar: '/avatars/default-avatar.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/home',
      icon: LucideHome,
      isActive: false,
    },
    {
      title: 'Search',
      url: '/search',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'New Search',
          url: '/search/new',
        },
        {
          title: 'Past Searches',
          url: '/search/past',
        },
      ],
    },
    {
      title: 'Lists',
      url: '/list',
      icon: BookOpen,
      items: [
        {
          title: 'View All Lists',
          url: '/list/all',
        },
        {
          title: 'Create New List',
          url: '/list/new',
        },
        {
          title: 'Share List',
          url: '/list/share',
        },
      ],
    },
    {
      title: 'Schedules',
      url: '/schedule',
      icon: Calendar,
      items: [
        {
          title: 'View Schedules',
          url: '/schedule/view',
        },
        {
          title: 'Set Alerts',
          url: '/alert',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/profile',
      icon: Settings2,
      items: [
        {
          title: 'Profile',
          url: '/profile',
        },
        {
          title: 'Preferences',
          url: '/preferences',
        },
        {
          title: 'Notifications',
          url: '/notifications',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Help',
      url: '/help',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '/feedback',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'My Price Tracker',
      url: '/projects/price-tracker',
      icon: Frame,
    },
    {
      name: 'Wishlist Manager',
      url: '/projects/wishlist-manager',
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <DollarSign className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Prizey</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
