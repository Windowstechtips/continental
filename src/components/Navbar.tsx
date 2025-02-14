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
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import PeopleIcon from '@mui/icons-material/People';
import ContactsIcon from '@mui/icons-material/Contacts';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CollectionsIcon from '@mui/icons-material/Collections';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import ContactDialog from './ContactDialog';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onToggleTheme: () => void;
  isDark: boolean;
}

const pages = [
  { name: 'Home', href: '#home' },
  { name: 'Subjects', href: '#subjects' },
  { name: 'Teachers', href: '#tutors' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'News', href: '#news' },
  { name: 'Store', href: '/store' },
  { name: 'Contact', href: '#contact' },
];

const navItems = [
  { label: 'Home', href: '/', icon: <HomeIcon /> },
  { label: 'Why Join Us', href: '/#why-join', icon: <HelpIcon /> },
  { label: 'Subjects', href: '/#subjects', icon: <SchoolIcon /> },
  { label: 'Teachers', href: '/#tutors', icon: <PeopleIcon /> },
  { label: 'News', href: '/#news', icon: <NewspaperIcon /> },
  { label: 'Gallery', href: '/#gallery', icon: <CollectionsIcon /> },
  { label: 'Store', href: '/store', icon: <ShoppingCartIcon /> },
];

const Navbar = ({ onToggleTheme, isDark }: NavbarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
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
            height: { xs: 45, sm: 50 },
            width: 'auto',
            objectFit: 'contain',
            filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
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
                  height: { xs: 45, sm: 50 },
                  width: 'auto',
                  objectFit: 'contain',
                  filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => (
                item.href.startsWith('/#') ? (
                  <Button
                    key={item.label}
                    href={item.href.substring(1)}
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
                ) : (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.href}
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
                )
              ))}
              <IconButton
                color="inherit"
                onClick={() => navigate(user ? '/account' : '/login')}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <AccountCircleIcon color={user ? "primary" : "inherit"} />
              </IconButton>
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