import { removeClient } from '@/firebase/clientApp'
import { ClientData } from '@/types'
import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { memo, useEffect, useState } from 'react'

type ClientFC = React.FC<{
    data: ClientData,
    onChange: (client: ClientData, status: 'in' | 'out', bool: boolean) => void,
    targetClients: ClientData[],
    out?: boolean,
    focused?: boolean,
    dangerMode?: boolean
}>

const Client: ClientFC = ({
    data, out, onChange, targetClients, focused, dangerMode
}) => {
    const router = useRouter()

    const handler = (bool: boolean) => {
        onChange(data, out ? 'in' : 'out', bool)
    }

    const selected = !!targetClients.find((client: ClientData) => client.id === data.id);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && focused) {
                handler(!selected)
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [focused, selected, handler]);

    const deleteHandler = () => {
        removeClient(data.id);
        router.push('?loading=true');
        setTimeout(() => {
            router.push('/')
            router.refresh()
        }, 1000)
    }

    return (
        <Box
            className='w-full flex p-4 rounded-lg shadowed justify-between relative'
            sx={{
                border: focused ? '1px solid #1976d2' : '1px solid transparent',
            }}
        >
            <Box
                className='w-full h-full rounded-lg absolute top-0 left-0 bg-white bg-opacity-90 z-10 flex-col items-center justify-center'
                sx={{
                    display: selected ? 'flex' : 'none'
                }}
            >
                <Typography className='z-20'>
                    Готов к занесению в новый список
                </Typography>

                <Button onClick={() => handler(false)}>
                    Отменить
                </Button>
            </Box>
            <Box>
                <Typography variant='h6'>{data.childName}</Typography>
                <Typography variant='body2'>{data.email}</Typography>
            </Box>
            <Box className='flex flex-col justify-center'>
                <Button onClick={() => handler(true)}>
                    {out ? "Пришел" : "Ушел"}
                </Button>
                {dangerMode ? <Button onClick={deleteHandler} color='error'>
                    Удалить
                </Button> : null}
            </Box>
        </Box>
    )
}

export default Client