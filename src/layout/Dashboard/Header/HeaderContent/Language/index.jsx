import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
// import mui react
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base';
import { Tooltip, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

// asset import
import englishIcon from 'assets/images/flags/england.png';
import thaiIcon from 'assets/images/flags/thailand.png';

// ==============================|| OUTPUT VALUES ||============================== //

const ChooseLanguageContent = memo(() => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  const checkLanguage = () => {
    if (i18n.language === 'en') return <img style={{ width: '20px', height: '20px' }} src={englishIcon} alt="English" />;
    else if (i18n.language === 'th') return <img style={{ width: '20px', height: '20px' }} src={thaiIcon} alt="Thai" />;
  };

  const handleMenu = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Listbox = styled('ul')(
    ({ theme }) => `
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      box-sizing: border-box;
      padding: 6px;
      margin: 12px;
      min-width: 200px;
      border-radius: 12px;
      overflow: auto;
      outline: 0;
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
      box-shadow: 0px 4px 6px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'};
      z-index: 1;
      `
  );
  return (
    <Dropdown>
      <Tooltip title={t('Change languages')}>
        <MenuButton onClick={(e) => handleMenu(e)}>{checkLanguage()}</MenuButton>
      </Tooltip>
      <Menu open={open} onClose={handleClose} slots={{ listbox: Listbox }} anchorEl={anchorEl}>
        <MenuItem onClick={() => handleLanguageChange('th')}>
          <img style={{ width: '20px', height: '20px', marginRight: '15px' }} src={thaiIcon} alt="Thai" />
          {t('Thai')}
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('en')}>
          <img style={{ width: '20px', height: '20px', marginRight: '15px' }} src={englishIcon} alt="English" />
          {t('English')}
        </MenuItem>
      </Menu>
    </Dropdown>
  );
});

export default ChooseLanguageContent;
