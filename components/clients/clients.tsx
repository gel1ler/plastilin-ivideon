'use client'
import { ClientData } from '@/types'
import { Box, CircularProgress, Divider, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Changes from '../changes'
import Client from './client'
import { useSearchParams } from 'next/navigation'

const Clients = ({ clients }: { clients: ClientData[] }) => {
    const hasComeClients = clients.filter(i => i.hasCome === true)
    const outClients = clients.filter(i => i.hasCome === false)

    const [newHasComeClients, setNewHasComeClients] = useState<ClientData[]>([])
    const [newOutClients, setNewOutClients] = useState<ClientData[]>([])
    const [focused, setFocused] = useState<number | null>(null)
    const [dangerMode, setDangerMode] = useState(false)

    const onChange = (client: ClientData, status: 'in' | 'out', bool: boolean) => {
        if (status === 'in') {
            if (bool)
                setNewHasComeClients([...newHasComeClients, client])
            else
                setNewHasComeClients(newHasComeClients.filter(i => i.id !== client.id))
        }
        else if (status === 'out') {
            if (bool)
                setNewOutClients([...newOutClients, client])
            else
                setNewOutClients(newOutClients.filter(i => i.id !== client.id))
        }

        setSearchTerm('')
        setFocused(null)
    }

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, [])

    const filteredHasComeClients = hasComeClients.filter(client =>
        client.childName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredOutClients = outClients.filter(client =>
        client.childName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            setFocused((prevFocused) => {
                if (prevFocused !== null) {
                    return prevFocused - 1 < 0 ? null : prevFocused - 1;
                }
                return prevFocused; // Return the current state if focused is null
            });
        } else if (event.key === 'ArrowDown') {
            setFocused((prevFocused) => {
                if (prevFocused !== null) {
                    return prevFocused + 1 >= (filteredHasComeClients.length + filteredOutClients.length) ? null : prevFocused + 1;
                } else {
                    return 0; // Set focused to 0 if it was null
                }
            });
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [filteredHasComeClients, filteredOutClients, handleKeyDown]);

    const searchParams = useSearchParams()
    const search = searchParams.get('loading')

    return (
        <Box className='w-full flex flex-col gap-4'>
            <Box
                className='bg-white w-screen h-screen fixed top-0 left-0 z-50 bg-opacity-90 flex-col justify-center items-center gap-4 overflow-hidden'
                sx={{
                    display: search ? 'flex' : 'none',
                }}
            >
                <CircularProgress />
            </Box>
            <Changes newHasComeClients={newHasComeClients} newOutClients={newOutClients} />
            <TextField
                label="Поиск клиента"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
            />
            <FormControlLabel sx={{ mx: 'auto' }} control={<Switch defaultChecked={dangerMode} onChange={e => setDangerMode(e.target.checked)}  color='error' />} label="Опасный режим" />
            <Typography variant="h5">
                Сейчас в детском центре:
            </Typography>
            {!filteredHasComeClients.length ? (
                <Typography textAlign='center' variant='h5' color='lightgray'>ПУСТО</Typography>
            ) : null}
            {filteredHasComeClients.map((client, index) => (
                <Client
                    dangerMode={dangerMode}
                    onChange={onChange}
                    key={index}
                    data={client}
                    targetClients={newOutClients}
                    focused={index === focused}
                />
            ))}

            <Divider />
            <Typography variant="h5">
                Не в дестком центре:
            </Typography>
            {!filteredOutClients.length ? (
                <Typography textAlign='center' variant='h5' color='lightgray'>ПУСТО</Typography>
            ) : null}
            {filteredOutClients.map((client, index) => (
                <Client
                    onChange={onChange}
                    key={index}
                    data={client}
                    targetClients={newHasComeClients}
                    focused={index + filteredHasComeClients.length === focused}
                    out
                    dangerMode={dangerMode}
                />
            ))}
        </Box>
    )
}

export default Clients