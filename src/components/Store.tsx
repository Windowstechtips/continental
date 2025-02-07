import { Box, Container, Grid, Typography, Card, CardContent, CardMedia, Button, Chip, useTheme, ToggleButtonGroup, ToggleButton, FormControl, InputLabel, Select, MenuItem, AppBar, Toolbar, Badge, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { fetchStoreProducts, type StoreProduct } from '../services/supabase';
import { useCart } from '../contexts/CartContext';
import { Snackbar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Store = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, itemCount } = useCart();
  const { user, userProfile } = useAuth();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Filter states
  const [selectedSyllabus, setSelectedSyllabus] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const productsData = await fetchStoreProducts();
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    // Show success message when returning from checkout
    if (location.state?.orderSuccess) {
      setShowSuccess(true);
    }
  }, [location.state]);

  // Get unique values for filters
  const subjects = ['all', ...new Set(products.map(p => p.subject).filter(Boolean))];
  const grades = ['all', ...new Set(products.map(p => p.grade).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSyllabus = selectedSyllabus === 'all' || product.syllabus === selectedSyllabus;
    const matchesGrade = selectedGrade === 'all' || product.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'all' || product.subject === selectedSubject;
    return matchesSyllabus && matchesGrade && matchesSubject;
  });

  const handleSyllabusChange = (
    _: React.MouseEvent<HTMLElement>,
    newSyllabus: string,
  ) => {
    if (newSyllabus !== null) {
      setSelectedSyllabus(newSyllabus);
    }
  };

  const renderFilters = () => (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <ToggleButtonGroup
            value={selectedSyllabus}
            exclusive
            onChange={handleSyllabusChange}
            aria-label="syllabus"
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1,
                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="cambridge">Cambridge</ToggleButton>
            <ToggleButton value="edexcel">Edexcel</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Grade</InputLabel>
            <Select
              value={selectedGrade}
              label="Grade"
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              {grades.map((grade) => (
                <MenuItem key={grade || 'all'} value={grade || 'all'}>
                  {grade === 'all' ? 'All Grades' : grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject || 'all'} value={subject || 'all'}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>Loading products...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    if (!filteredProducts || filteredProducts.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>No products available for the selected filters.</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {filteredProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image_url || '/placeholder-image.jpg'}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.syllabus && (
                      <Chip
                        label={product.syllabus}
                        size="small"
                        sx={{ 
                          backgroundColor: product.syllabus.toLowerCase() === 'edexcel' ? 'info.main' : 'error.main',
                          color: 'white'
                        }}
                      />
                    )}
                    {product.subject && (
                      <Chip
                        label={product.subject}
                        size="small"
                        sx={{ backgroundColor: theme.palette.secondary.main, color: 'white' }}
                      />
                    )}
                    {product.grade && (
                      <Chip
                        label={product.grade}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="h6" color="primary.main">
                      Rs. {product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => addToCart(product)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Custom store navigation
  const renderStoreNav = () => (
    <AppBar 
      position="fixed" 
      color="inherit" 
      sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left side - Home button */}
          <IconButton
            component={Link}
            to="/"
            color="inherit"
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <HomeIcon />
          </IconButton>

          {/* Center - Store title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            Continental College Store
          </Typography>

          {/* Right side - Account, Cart and Checkout */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {user && userProfile && (
              <Typography variant="body1" sx={{ mr: 2 }}>
                Hi, {userProfile.full_name.split(' ')[0]}
              </Typography>
            )}
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
            <IconButton
              color="inherit"
              onClick={() => navigate('/checkout')}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Badge badgeContent={itemCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Button
              variant="contained"
              startIcon={<ShoppingBagIcon />}
              onClick={() => navigate('/checkout')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Checkout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );

  return (
    <>
      {renderStoreNav()}
      <Box
        component="section"
        sx={{
          py: { xs: 6, sm: 8 },
          backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8f9fa',
          mt: '64px', // Add margin top to account for fixed AppBar
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: { xs: 4, sm: 6 },
                color: 'primary.main',
                fontSize: { xs: '2.25rem', sm: '2.5rem' },
              }}
            >
              Our Products
            </Typography>
          </motion.div>
          {renderFilters()}
          {renderContent()}
        </Container>
      </Box>
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        message="Order placed successfully!"
      />
    </>
  );
};

export default Store; 