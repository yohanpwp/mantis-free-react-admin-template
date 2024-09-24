// assets
import { DashboardOutlined, CreditCardOutlined, FieldTimeOutlined  } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  CreditCardOutlined,
  FieldTimeOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/dashboard/default',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'payment',
      title: 'Payment',
      type: 'collapse',
      url: '/payment',
      icon: icons.CreditCardOutlined,
      breadcrumbs: false,
      children: [
        {
          id: 'payment-default',
          title: 'QR Code',
          type: 'item',
          url: '/payment/default',
          icon: icons.CreditCardOutlined,
          breadcrumbs: false
        },
        {
          id: 'payment-history',
          title: 'History',
          type: 'item',
          url: '/payment/history',
          icon: icons.FieldTimeOutlined,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default dashboard;
