import React from 'react';
//ui material
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import Grid from '@mui/material/Grid';
//components
import '../../App.css';


const Contactus = () => {

    return (
        <Box>
            <Grid container justifyContent="center" direction="column" alignItems="center" className='eyTheme' maring="20" >
                <Typography variant="h4" gutterBottom component="div" color="#FFE600"> Contact us </Typography>
                <Typography variant="subtitle1" gutterBottom component="div" color="#FFFFFF">Like what you’ve seen? Get in touch to learn more.</Typography>
                <EmailIcon style={{ fill: '#FFFFFF' }} maringButtom="20rem" />
            </Grid>
        </Box>

    )
}
export default Contactus; 