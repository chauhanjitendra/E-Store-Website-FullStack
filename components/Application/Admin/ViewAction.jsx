import { RemoveRedEye } from '@mui/icons-material';
import { ListItemIcon, MenuItem } from '@mui/material';
import { View } from 'lucide-react';
import Link from 'next/link';
import React from 'react';


const ViewAction = ({ href }) => {
  return (
    <MenuItem key={View}>
      <Link className='flex items-center'href={href}>
        <ListItemIcon>
          <RemoveRedEye/>
        </ListItemIcon>
        View
      </Link>
    </MenuItem>
  );
};

export default ViewAction;
