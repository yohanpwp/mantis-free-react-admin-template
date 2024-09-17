// assets
import { DashboardOutlined, CreditCardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  CreditCardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'payment',
      title: 'Payment',
      type: 'item',
      url: '/payment/default',
      icon: icons.CreditCardOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
