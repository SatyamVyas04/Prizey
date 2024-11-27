import { AppSidebar } from '@/components/application/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AuthProvider from '../../providers/authProvider';

export default function page({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
