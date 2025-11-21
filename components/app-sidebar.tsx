'use client'

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconShoppingCart,
  IconPackage,
  IconUsers,
  IconReceipt,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconLogout,
  IconTrendingUp,
  IconTags,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: IconPackage,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: IconReceipt,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: IconUsers,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Sales",
      icon: IconTrendingUp,
      isActive: true,
      url: "/dashboard/sales",
      items: [
        {
          title: "Revenue",
          url: "/dashboard/sales/revenue",
        },
        {
          title: "Top Products",
          url: "/dashboard/sales/top-products",
        },
      ],
    },
    {
      title: "Promotions",
      icon: IconTags,
      url: "/dashboard/promotions",
      items: [
        {
          title: "Active Deals",
          url: "/dashboard/promotions/active",
        },
        {
          title: "Coupons",
          url: "/dashboard/promotions/coupons",
        },
      ],
    },
    {
      title: "Inventory",
      icon: IconShoppingCart,
      url: "/dashboard/inventory",
      items: [
        {
          title: "Stock Levels",
          url: "/dashboard/inventory/stock",
        },
        {
          title: "Low Stock",
          url: "/dashboard/inventory/low-stock",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Recent Orders",
      url: "/dashboard/orders",
      icon: IconReceipt,
    },
    {
      name: "Cart Summary",
      url: "/dashboard/cart-summary",
      icon: IconShoppingCart,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: IconChartBar,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    username: string
    email: string
    avatar: string
  }
}

export function AppSidebar({  ...props }: AppSidebarProps) {
  

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
    </Sidebar>
  )
}