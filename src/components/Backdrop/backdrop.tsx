import { styled } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 50,
  color: '#fff',
}));

type BackProps = {
    open: boolean;
  };
 const BackdropLoading: React.FC<BackProps> = ({open}) =>{
    return(
        <StyledBackdrop open={open}>
        <CircularProgress color="inherit" />
        </StyledBackdrop>
    )
}
export default BackdropLoading