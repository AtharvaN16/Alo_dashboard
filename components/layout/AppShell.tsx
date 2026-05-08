import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DateRangeProvider } from './DateRangeContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DateRangeProvider>
      <Topbar />
      <Sidebar />
      <main className="ml-60 pt-20">{children}</main>
    </DateRangeProvider>
  );
}
