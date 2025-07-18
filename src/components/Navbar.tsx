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
  Badge,
  Tooltip,
  alpha,
  Chip
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useEffect } from 'react';
import ContactDialog from './ContactDialog';
import CurriculumSelectionDialog from './CurriculumSelectionDialog';
import { useAuth } from '../contexts/AuthContext';
import { useCurriculum } from '../contexts/CurriculumContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onToggleTheme: () => void;
  isDark: boolean;
}

const navItems = [
  { label: 'Home', href: '/', icon: <HomeIcon /> },
  { label: 'Why Join Us', href: '/#why-join', icon: <HelpIcon /> },
  { label: 'Subjects', href: '/#subjects', icon: <SchoolIcon /> },
  { label: 'Teachers', href: '/#tutors', icon: <PeopleIcon /> },
  { label: 'News', href: '/#news', icon: <NewspaperIcon /> },
  { label: 'Gallery', href: '/#gallery', icon: <CollectionsIcon /> },
  // { label: 'Store', href: '/store', icon: <ShoppingCartIcon /> }, // Temporarily hidden
];

const Navbar = ({ onToggleTheme, isDark }: NavbarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { curriculum, selectedGrade } = useCurriculum();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [curriculumDialogOpen, setCurriculumDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleContactOpen = () => {
    setContactOpen(true);
  };

  const handleContactClose = () => {
    setContactOpen(false);
  };

  const handleCurriculumDialogOpen = () => {
    setCurriculumDialogOpen(true);
  };

  const handleCurriculumDialogClose = (selectedData?: { curriculum: string; selectedGrade: string }) => {
    setCurriculumDialogOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (href.startsWith('/#')) {
      const hash = href.substring(1);
      if (location.pathname === '/') {
        return location.hash === hash;
      }
      return false;
    }
    return location.pathname === href;
  };

  const drawer = (
    <Box sx={{ 
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(180deg, #132f4c 0%, #0a1929 100%)' 
        : 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
    }}>
      <Box
        sx={{
          py: 3,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          component="img"
          src="/misc/main.png"
          alt="Continental College"
          sx={{
            height: 50,
            width: 'auto',
            objectFit: 'contain',
            filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
          }}
        />
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={handleDrawerToggle}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flex: 1, py: 2 }}>
        <AnimatePresence>
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ 
                    textAlign: 'left',
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': isActive(item.href) ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: 'primary.main',
                      borderRadius: '0 4px 4px 0',
                    } : {},
                    ...(isActive(item.href) && {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    })
                  }}
                  href={item.href}
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: isActive(item.href) ? 'primary.main' : 'text.secondary',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      fontWeight: isActive(item.href) ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
        >
          <ListItem disablePadding>
            <ListItemButton
              sx={{ 
                textAlign: 'left',
                py: 1.5,
                px: 3,
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
              }}
              onClick={handleContactOpen}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: 'primary.main',
              }}>
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Contact Us" 
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        </motion.div>
      </List>
      
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onToggleTheme}
          startIcon={isDark ? <Brightness7Icon /> : <Brightness4Icon />}
          sx={{ width: '100%' }}
        >
          {isDark ? "Light" : "Dark"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        component={motion.div}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        position="fixed" 
        elevation={scrolled ? 4 : 0}
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' 
            ? scrolled 
              ? alpha(theme.palette.background.paper, 0.95)
              : alpha(theme.palette.background.paper, 0.9)
            : scrolled
              ? alpha(theme.palette.background.paper, 0.95)
              : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          borderBottom: scrolled ? 'none' : '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            px: { xs: 1, sm: 2 },
            height: scrolled ? 56 : 64,
            transition: 'height 0.3s ease',
          }}>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
              }}
              component={motion.a}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#home"
            >
              <Box
                component="img"
                src="/misc/main.png"
                alt="Continental College"
                sx={{
                  height: { xs: 45, sm: scrolled ? 45 : 50 },
                  width: 'auto',
                  objectFit: 'contain',
                  filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
                  transition: 'height 0.3s ease',
                }}
              />
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    ml: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              gap: 0.5 
            }}>
              {navItems.map((item) => (
                item.href.startsWith('/#') ? (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -3 }}
                    whileTap={{ y: 0 }}
                  >
                    <Button
                      href={item.href.substring(1)}
                      startIcon={item.icon}
                      sx={{
                        color: isActive(item.href) ? 'primary.main' : 'text.primary',
                        fontWeight: isActive(item.href) ? 600 : 400,
                        mx: 0.5,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': isActive(item.href) ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '30%',
                          height: '3px',
                          backgroundColor: 'primary.main',
                          borderRadius: '3px 3px 0 0',
                        } : {},
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -3 }}
                    whileTap={{ y: 0 }}
                  >
                    <Button
                      component={Link}
                      to={item.href}
                      startIcon={item.icon}
                      sx={{
                        color: isActive(item.href) ? 'primary.main' : 'text.primary',
                        fontWeight: isActive(item.href) ? 600 : 400,
                        mx: 0.5,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': isActive(item.href) ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '30%',
                          height: '3px',
                          backgroundColor: 'primary.main',
                          borderRadius: '3px 3px 0 0',
                        } : {},
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                )
              ))}
              
              <Box sx={{ display: 'flex', ml: 1, gap: 1 }}>
                {/* Curriculum Selection Button */}
                {curriculum && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<SettingsIcon />}
                      onClick={handleCurriculumDialogOpen}
                      sx={{
                        borderRadius: 8,
                        px: 2,
                        py: 1,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      {curriculum.charAt(0).toUpperCase() + curriculum.slice(1)} - Grade {selectedGrade}
                    </Button>
                  </motion.div>
                )}
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ContactsIcon />}
                    sx={{
                      borderRadius: 8,
                      px: 2,
                      py: 1,
                      boxShadow: scrolled ? 2 : 0,
                      background: 'linear-gradient(90deg, #0056b3, #0077cc)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #003b7a, #0056b3)',
                      }
                    }}
                    onClick={handleContactOpen}
                  >
                    Contact Us
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                  <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                    <IconButton 
                      sx={{ 
                        ml: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                        }
                      }} 
                      onClick={onToggleTheme} 
                    >
                      {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderRight: 'none',
            boxShadow: 24,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Dialogs */}
      <ContactDialog open={contactOpen} onClose={handleContactClose} />
      <CurriculumSelectionDialog open={curriculumDialogOpen} onClose={handleCurriculumDialogClose} />
    </>
  );
};

export default Navbar; 