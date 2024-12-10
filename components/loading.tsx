import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import DoneIcon from '@mui/icons-material/Done';

const Loading = ({ loading, finished }: { loading: boolean, finished: boolean }) => {
    return (
        <Box
            className='bg-white w-screen h-screen fixed top-0 left-0 z-50 bg-opacity-90 flex-col justify-center items-center gap-4 overflow-hidden'
            sx={{
                display: loading ? 'flex' : 'none',
            }}
        >
            <Box className="transition-transform duration-500" sx={{ transform: `translateY(${finished ? '-70vh' : '0'})` }} >
                <CircularProgress />
            </Box>
            <Typography textAlign='center' className="transition-transform duration-700" sx={{ transform: `translateY(${finished ? '-70vh' : '0'})` }}>
                Отправляем изменения <br />
                ~20 сек
            </Typography>

            <DoneIcon fontSize='large' color='success' className="transition-transform duration-500" sx={{ transform: `translateY(${finished ? '-10vh' : '70vh'})` }} />
            <Typography className="transition-transform duration-700" textAlign='center' sx={{ transform: `translateY(${finished ? '-10vh' : '70vh'})` }}>
                Права настроены успешно
            </Typography>
        </Box>
    )
}

export default Loading