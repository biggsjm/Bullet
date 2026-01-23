import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PWAPrompt } from './components/ui/PWAPrompt';
import { DailyLogPage } from './pages/DailyLogPage/DailyLogPage';
import { MonthlyLogPage } from './pages/MonthlyLogPage/MonthlyLogPage';
import { FutureLogPage } from './pages/FutureLogPage/FutureLogPage';
import { IndexPage } from './pages/IndexPage/IndexPage';
import { CollectionPage } from './pages/CollectionPage/CollectionPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';

export function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/daily" replace />} />
          <Route path="/daily" element={<DailyLogPage />} />
          <Route path="/monthly" element={<MonthlyLogPage />} />
          <Route path="/future" element={<FutureLogPage />} />
          <Route path="/index" element={<IndexPage />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <PWAPrompt />
    </>
  );
}
