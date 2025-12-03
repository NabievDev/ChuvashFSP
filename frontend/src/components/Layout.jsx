import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CustomCursor from './CustomCursor'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col cursor-none">
      <CustomCursor />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
