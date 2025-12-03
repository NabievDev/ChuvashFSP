import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Leadership from './pages/Leadership'
import Team from './pages/Team'
import Documents from './pages/Documents'
import Events from './pages/Events'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Contacts from './pages/Contacts'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminNews from './pages/admin/AdminNews'
import AdminEvents from './pages/admin/AdminEvents'
import AdminDocuments from './pages/admin/AdminDocuments'
import AdminTeam from './pages/admin/AdminTeam'
import AdminLeadership from './pages/admin/AdminLeadership'
import AdminMessages from './pages/admin/AdminMessages'
import AdminLayout from './components/AdminLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="leadership" element={<Leadership />} />
        <Route path="team" element={<Team />} />
        <Route path="documents" element={<Documents />} />
        <Route path="events" element={<Events />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="contacts" element={<Contacts />} />
      </Route>
      
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="leadership" element={<AdminLeadership />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>
    </Routes>
  )
}

export default App
