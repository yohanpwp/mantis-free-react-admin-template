// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { Tooltip, Stack } from '@mui/material';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// asset import
import { GithubOutlined } from '@ant-design/icons';
import englishIcon from 'assets/images/flags/england.png';
// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Stack direction={'row'} alignItems={'center'}>
      <Tooltip title="Change languages">
        <img style={{ width: '20px', height: '20px' }} src={englishIcon} alt="English" />
      </Tooltip>
      <Profile />
      {/* {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton>
      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />} */}
    </Stack>
  );
}
