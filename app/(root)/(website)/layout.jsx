import Footer from '@/components/Application/website/Footer'
import Header from '@/components/Application/website/Header'
import React from 'react'
import { Kumbh_Sans } from 'next/font/google'

const Kumbh = Kumbh_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700','800'],
  display: 'swap',
  subsets: ['latin']
})

const layout = ({children}) => {
  return (
    <div className={Kumbh.className}>
      <Header/>
       <main>
        {children}
       </main>
      <Footer/>
    </div>
  )
}

export default layout