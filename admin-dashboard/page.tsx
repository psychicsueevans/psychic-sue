'use client';

import AdminDashboardInteractive from './components/AdminDashboardInteractive';
import AuthNavigation from '@/components/common/AuthNavigation';
import MobileNavToggle from '@/components/common/MobileNavToggle';

const AdminDashboardPage = () => {
  return (
    <AuthNavigation isAuthenticated={false}>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <AdminDashboardInteractive />
      </div>
      <MobileNavToggle isAuthenticated={false} />
    </AuthNavigation>
  );
};

export default AdminDashboardPage;