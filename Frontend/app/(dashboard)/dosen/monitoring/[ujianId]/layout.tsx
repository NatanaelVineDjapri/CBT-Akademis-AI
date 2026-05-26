import { MonitoringConnectionProvider } from "@/contexts/MonitoringConnectionContext";

export default function MonitoringUjianLayout({ children }: { children: React.ReactNode }) {
  return <MonitoringConnectionProvider>{children}</MonitoringConnectionProvider>;
}
