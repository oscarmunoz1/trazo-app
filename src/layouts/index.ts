import Admin from './Admin';
import Auth from './Auth';
import Consumer from './Consumer';
import AdminConsumer from './AdminConsumer';

// Export Admin layout as DashboardLayout for backward compatibility
export const DashboardLayout = Admin;

// Export all layouts
export { Admin, Auth, Consumer, AdminConsumer };

export default {
  DashboardLayout: Admin,
  Admin,
  Auth,
  Consumer,
  AdminConsumer
};
