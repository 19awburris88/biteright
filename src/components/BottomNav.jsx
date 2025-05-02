import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
  } from '@mui/material';
  import RestaurantIcon from '@mui/icons-material/Restaurant';
  import StarIcon from '@mui/icons-material/Star';
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
          left: 0,
          right: 0,
          bgcolor: '#fffaf6',
          borderTop: '1px solid #eee',
        }}
        elevation={6}
      >
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(newValue);
          }}
          showLabels
          sx={{
            bgcolor: '#fffaf6',
            '& .Mui-selected': {
              color: '#D35400', // active color
            },
          }}
        >
          <BottomNavigationAction
            label="Swipe"
            value="/swipe"
            icon={<RestaurantIcon />}
          />
          <BottomNavigationAction
            label="Matches"
            value="/matches"
            icon={<StarIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            value="/profile"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </Paper>
    );
  }
  