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

const data = {
  user: {
    name: 'Pricey User',
    email: 'user@priceyapp.com',
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
      url: '/search/new',
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
      url: '/lists',
      icon: BookOpen,
      items: [
        {
          title: 'View All Lists',
          url: '/lists/view',
        },
        {
          title: 'Create New List',
          url: '/lists/new',
        },
      ],
    },
    {
      title: 'Scheduled Activities',
      url: '/scheduled',
      icon: Calendar,
      items: [
        {
          title: 'View Schedule',
          url: '/scheduled/view',
        },
        {
          title: 'Set Alerts',
          url: '/scheduled/alerts',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
      items: [
        {
          title: 'Profile',
          url: '/settings/profile',
        },
        {
          title: 'Preferences',
          url: '/settings/preferences',
        },
        {
          title: 'Notifications',
          url: '/settings/notifications',
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
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <DollarSign className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Pricey</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
