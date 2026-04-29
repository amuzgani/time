import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/route_paths';
import NotFoundPage from '@/views/common/NotFoundPage';
import AttendanceCalculatorPage from '@/views/attendance/AttendanceCalculatorPage';

export default function AppRouter(): React.ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATHS.ROOT} element={<AttendanceCalculatorPage />} />
        <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={ROUTE_PATHS.ROOT} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
