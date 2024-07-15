import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import PlaceIcon from '@mui/icons-material/Place'
import logo from '@/public/logo-gorizontal.svg'

const Header = () => {
    return (
        <Box className='w-screen flex justify-center'>
            <Link href='/' >
                <Image
                    alt='Логотип детского центра Пластилин'
                    src={logo}
                    style={{ objectFit: 'contain', height: '50px', width: 'min-content', display: 'block' }}
                />
            </Link>
        </Box>
    )
}

export default Header