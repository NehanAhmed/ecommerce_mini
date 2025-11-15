import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getCurrentUser } from '@/lib/action/getCurrentUser.actions'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const userData = await getCurrentUser()

    const user = userData ? {
        username: userData.firstName || "Guest User",
        email: userData.email || "guest@example.com",
        avatar: userData.imageUrl || "/avatars/shadcn.jpg",
    } : {
        username: "Guest User",
        email: "guest@example.com",
        avatar: "/avatars/shadcn.jpg",
    }
    return (
        <main className='w-full min-h-screen'>

            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar user={user} variant="floating" />
                <SidebarInset>
                    <SiteHeader />
                    

                        {children}
                    

                </SidebarInset>
            </SidebarProvider>
        </main>
    )
}

export default layout