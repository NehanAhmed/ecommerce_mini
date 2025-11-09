import React from 'react'
import Header from '../_components/Header'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <Header />
            {children}
        </main>
    )
}

export default layout