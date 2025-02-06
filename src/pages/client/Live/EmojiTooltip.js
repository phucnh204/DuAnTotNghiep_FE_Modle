// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import EmojiPicker from 'emoji-picker-react';
// import { Typography, useMediaQuery } from '@mui/material';
// const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
//     [`& .${tooltipClasses.tooltip}`]: {
//         backgroundColor: 'white',
//         color: 'rgba(0, 0, 0, 0.87)',
//         maxWidth: 420,
//         fontSize: theme.typography.pxToRem(12),
//     },
// }));

//  function  VariableWidth({}) {
//     const isSmallScreen = useMediaQuery('(max-width:600px)');
//     const tooltipPlacement = isSmallScreen ? 'top' : 'left-start';
//     const [chosenEmoji, setChosenEmoji] = React.useState(null);
//    const onEmojiClick = (event, emojiObject) => { setChosenEmoji(emojiObject); };    
//     const [open, setOpen] = React.useState(false);
//    const handleTooltipClose = () => { setOpen(false); }; const handleTooltipOpen = () => { setOpen(true); }; 
// //    const onEmojiClick = (event, emojiObject) => { setChosenEmoji(emojiObject); };
//     return (
//         <div>
//             <HtmlTooltip
//                 className="shadow-md"
//                 arrow
//                 placement={tooltipPlacement}
//                 title={
//                     <React.Fragment>
//                         <Typography  className="text-xs" style={{ width: '300px' }} color="inherit">
                            
//                         </Typography>
//                          <EmojiPicker onEmojiClick={onEmojiClick} /> {chosenEmoji && <p>You picked: {chosenEmoji.emoji}</p>}
                       
//                     </React.Fragment>
//                 }
//             >
//             <Button onMouseOver={()=>{
//             }}><span className='text-red-600 mr-1'></span>Pick tooltip</Button>
//             </HtmlTooltip>
//         </div>
//     );
// }
// export default React.memo( VariableWidth) 
import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import { useMediaQuery } from '@mui/material';
import { BsEmojiFrownFill, BsEmojiSmile } from 'react-icons/bs';

export default function PositionedPopper() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
      const tooltipPlacement = isSmallScreen ? 'top' : 'left-start';
      const [chosenEmoji, setChosenEmoji] = React.useState(null);
     const onEmojiClick = (event, emojiObject) => {
      document.getElementById("comments").value=document.getElementById("comments").value+event.emoji
      
    
    };    

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  return (
    <Box className="absolute  right-1.5 top-1.5 text-slate-600 cursor-pointer" sx={{ width: "100px" }}>
      <Popper
        // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
            <EmojiPicker onEmojiClick={onEmojiClick} /> {chosenEmoji && <p>You picked: {chosenEmoji.emoji}</p>}
            </Paper>
          </Fade>
        )}
      </Popper>
      <Grid container sx={{ justifyContent: 'center' }}>
        <Grid item>
          <Button cla onClick={handleClick('top-end')}> <BsEmojiSmile color='white'/> </Button>
        </Grid>
      </Grid>
    
    </Box>
  );
}