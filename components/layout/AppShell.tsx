import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DateRangeProvider } from './DateRangeContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DateRangeProvider>
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-60">
          <Topbar />
          <main>{children}</main>
        </div>
      </div>
    </DateRangeProvider>
  );
}
