'use client'
import { ClientData } from '@/types'
import { Box, Button, CircularProgress, Divider, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Changes from '../changes'
import Client from './client'
import { useSearchParams } from 'next/navigation'
import { denyAll } from '@/firebase/clientApp'
import Search from '../search'
import DenyAllClients from '../denyAllClients'
import Loading from '../loading'

const Clients = ({ clients }: { clients: ClientData[] }) => {
    const hasComeClients = clients.filter(i => i.hasCome === true)
    const outClients = clients.filter(i => i.hasCome === false)

    const [newHasComeClients, setNewHasComeClients] = useState<ClientData[]>([])
    const [newOutClients, setNewOutClients] = useState<ClientData[]>([])
    const [dangerMode, setDangerMode] = useState(false)

    //Loading
    const [loading, setLoading] = useState(false)
    const [finished, setFinished] = useState(false)

    //Смена статуса клиента "на клиенте"
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
    }

    const [focused, setFocused] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHasComeClients: ClientData[] = hasComeClients.filter(client =>
        client.childName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredOutClients: ClientData[] = outClients.filter(client =>
        client.childName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Перемещение по пользователям через клавиатуру


    const searchParams = useSearchParams()
    const search = searchParams.get('loading')

    return (
        <Box className='w-full flex flex-col gap-4'>
            <Loading loading={loading} finished={finished} />
            <Box
                className='bg-white w-screen h-screen fixed top-0 left-0 z-50 bg-opacity-90 flex-col justify-center items-center gap-4 overflow-hidden'
                sx={{
                    display: search ? 'flex' : 'none',
                }}
            >
                <CircularProgress />
            </Box>
            <Changes
                setLoading={setLoading}
                setFinished={setFinished}
                newHasComeClients={newHasComeClients}
                newOutClients={newOutClients}
            />
            <Search
                setFocused={setFocused}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                filteredHasComeClients={filteredHasComeClients}
                filteredOutClients={filteredOutClients}
            />
            <FormControlLabel sx={{ mx: 'auto' }} control={<Switch defaultChecked={dangerMode} onChange={e => setDangerMode(e.target.checked)} color='error' />} label="Опасный режим" />
            <Typography variant="h5">
                Сейчас в детском центре:
            </Typography>
            {!filteredHasComeClients.length ?
                <Typography textAlign='center' variant='h5' color='lightgray'>ПУСТО</Typography>
                :
                <DenyAllClients setLoading={setLoading} setFinished={setFinished} />
            }
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