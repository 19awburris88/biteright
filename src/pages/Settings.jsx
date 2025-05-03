import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Divider,
  } from '@mui/material';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  
  export default function SettingsMenu() {
    return (
      <>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Your Taste Profile</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>ZIP: 75206</Typography>
            <Typography>Price Range: $$</Typography>
            <Typography>Top Tags: spicy, grilled, savory</Typography>
          </AccordionDetails>
        </Accordion>
  
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Favorites</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>• Pecan Lodge</Typography>
            <Typography>• Uchi Dallas</Typography>
          </AccordionDetails>
        </Accordion>
  
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">About BiteRight</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              BiteRight helps you discover Dallas restaurants based on your taste.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </>
    );
  }
  