import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getCurrentUser } from '@/lib/action/getCurrentUser.actions'
import React from 'react'

const layout = async({ children }: { children: React.ReactNode }) => {
    const userData = await getCurrentUser()

    const user = userData ? {
        name: userData[0] || "Guest User",
        email: userData[1] || "guest@example.com",
        avatar: "/avatars/shadcn.jpg",
    } : undefined
    return (
        <main>

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