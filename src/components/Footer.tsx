import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/misc/main.png"
              alt="Continental College"
              sx={{
                height: { xs: 60, sm: 75 },
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)', // Makes the logo white
                mb: 2,
              }}
            />
            <Typography variant="body2" color="white" sx={{ mt: 1, opacity: 0.7 }}>
              Unlock Your Potential, Embrace Education
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="inherit" 
                aria-label="Facebook"
                href="https://www.facebook.com/profile.php?id=100094247400118"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon sx={{ mt: 0.5 }} />
                <Typography variant="body2">
                  No. 10, Vincent Joseph Mawatha, Old Negombo Road, Wattala, Sri Lanka
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon />
                <Typography variant="body2">071 123 3233</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon />
                <Typography variant="body2">continentalwattala@gmail.com</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            mt: 4,
            pt: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Continental College. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 