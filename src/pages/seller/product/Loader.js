import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';

export default function DescriptionAlerts() {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert  icon={false}  severity="success">
                <div style={{display:"flex",justifyItems:"center",alignItems:"center"}}>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <CircularProgress size="17px" />
                    </Stack>
                    <p className='ml-2 mt-2 text-green-800 text-sm'>Đang upload ảnh....</p>
                </div>
                
                
            </Alert>
        </Stack>
    );
}
