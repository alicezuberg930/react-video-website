// import { forwardRef } from 'react';
// icons
import { Icon } from '@iconify/react';
// @mui
import { Box } from '@mui/material';
//
// import { IconifyProps } from './types';

// ----------------------------------------------------------------------

// interface Props extends BoxProps {
//   icon: IconifyProps;
// }

const Iconify = ({ icon, width = 20, ...sx }) => {
  return (
    <Box component={Icon} icon={icon} sx={{ width, height: width, ...sx }} />
  )
};

export default Iconify;
