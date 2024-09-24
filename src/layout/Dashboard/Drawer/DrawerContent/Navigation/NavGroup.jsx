import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, Route, Routes, MemoryRouter, useLocation } from 'react-router-dom';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ListItemButton, ListItemText, ListItemIcon, Collapse } from '@mui/material';

// icons from ant-design
import { UpOutlined, DownOutlined } from '@ant-design/icons';
// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';

export default function NavGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  function ListItemLink(props) {
    const { open, ...other } = props;
    const title = props.title;
    const Icon = props.icon;
    const itemIcon = props.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;
    let icon = null;
    if (open != null) {
      icon = open ? <UpOutlined /> : <DownOutlined />;
    }
    return (
      <li>
        <ListItemButton {...other}>
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: 'text.primary',
              pl: 1.5,
              pr: 1.5
            }}
          >
            {itemIcon}
          </ListItemIcon>
          <ListItemText primary={title} />
          {icon}
        </ListItemButton>
      </li>
    );
  }

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return (
          <List key={menuItem.id}>
            <ListItemLink key={menuItem.id} open={open} title={menuItem.title} icon={menuItem.icon} onClick={handleClick} />
            <Collapse component="li" in={open} timeout="auto" unmountOnExit>
              {menuItem.children?.map((index) => {
                return <NavItem key={index.id} item={index} level={2} />;
              })}
            </Collapse>
          </List>
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      key={item.id}
      subheader={
        item?.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.object };
