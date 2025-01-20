import { 
  AppBar, 
  Box, 
  Container, 
  IconButton, 
  Toolbar, 
  Button,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import PeopleIcon from '@mui/icons-material/People';
import ContactsIcon from '@mui/icons-material/Contacts';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState } from 'react';
import ContactDialog from './ContactDialog';

interface NavbarProps {
  onToggleTheme: () => void;
  isDark: boolean;
}

const navItems = [
  { label: 'Home', href: '#home', icon: <HomeIcon /> },
  { label: 'Why Join Us', href: '#why-join', icon: <HelpIcon /> },
  { label: 'Our Tutors', href: '#tutors', icon: <PeopleIcon /> },
];

const Navbar = ({ onToggleTheme, isDark }: NavbarProps) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleContactOpen = () => {
    setContactOpen(true);
  };

  const handleContactClose = () => {
    setContactOpen(false);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          component="img"
          src="/misc/main.png"
          alt="Continental College"
          sx={{
            height: { xs: 45, sm: 55 },
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center' }}
              href={item.href}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: 'primary.main',
                justifyContent: 'center',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: 'center' }}
            onClick={handleContactOpen}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: 'primary.main',
              justifyContent: 'center',
            }}>
              <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Contact Us" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: 'center' }}
            onClick={onToggleTheme}
          >
            <ListItemIcon sx={{ 
              minWidth: 40,
              color: 'primary.main',
              justifyContent: 'center',
            }}>
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText primary={isDark ? "Light Mode" : "Dark Mode"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        color="inherit" 
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
        }}
      >
        <Container maxWidth={false}>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
              component="a"
              href="#home"
            >
              <Box
                component="img"
                src="/misc/main.png"
                alt="Continental College"
                sx={{
                  height: { xs: 45, sm: 55 },
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  startIcon={item.icon}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="contained"
                color="primary"
                startIcon={<ContactsIcon />}
                sx={{
                  borderRadius: 25,
                  px: 3,
                }}
                onClick={handleContactOpen}
              >
                Contact Us
              </Button>
              <IconButton 
                sx={{ ml: 1 }} 
                onClick={onToggleTheme} 
                color="inherit"
                aria-label="toggle dark mode"
              >
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
          },
        }}
      >
        {drawer}
      </Drawer>

      <ContactDialog open={contactOpen} onClose={handleContactClose} />
    </>
  );
};

export default Navbar; 