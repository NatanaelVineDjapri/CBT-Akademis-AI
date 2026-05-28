import { MonitoringConnectionProvider } from "@/contexts/MonitoringConnectionContext";

export default function AdminMonitoringUjianLayout({ children }: { children: React.ReactNode }) {
  return <MonitoringConnectionProvider>{children}</MonitoringConnectionProvider>;
}
