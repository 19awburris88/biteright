import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        bgcolor: '#0f1520',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
          navigate(newValue);
        }}
        showLabels
        sx={{
          bgcolor: '#0f1520',
          '& .MuiBottomNavigationAction-root': {
            color: '#64748B',
            minWidth: 0,
          },
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            color: '#F72545',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.68rem',
            fontWeight: 500,
          },
          '& .MuiBottomNavigationAction-root.Mui-selected .MuiBottomNavigationAction-label': {
            fontWeight: 700,
          },
        }}
      >
        <BottomNavigationAction label="Discover" value="/swipe" icon={<RestaurantMenuIcon />} />
        <BottomNavigationAction label="Matches" value="/matches" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Profile" value="/profile" icon={<PersonIcon />} />
        <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
