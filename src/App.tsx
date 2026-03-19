import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProjectsView } from './views/ProjectsView';
import { RecentView } from './views/RecentView';
import { SettingsView } from './views/SettingsView';
import { ReviewView } from './views/ReviewView';
import { PrepView } from './views/PrepView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="projects" element={<ProjectsView />} />
          <Route path="recent" element={<RecentView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
        <Route path="/review/:assetId?" element={<ReviewView />} />
        <Route path="/prep/:assetId" element={<PrepView />} />
      </Routes>
    </Router>
  );
}
