import React from 'react'
import Header from '../_components/Header'
import Footer from '../_components/Footer'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <Header />
            {children}
            <Footer />

        </main>
    )
}

export default layout