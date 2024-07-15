'use client'
import { addClient } from '@/firebase/clientApp'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Create = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const router = useRouter()

    const add = () => {
        try {
            addClient(name, email)
            setName('')
            setEmail('')
            router.push('?loading=true');
            setTimeout(() => {
                router.push('/')
                router.refresh()
            }, 1000)
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <Box className=' fixed right-10 top-1/2 -translate-y-1/2 w-96 shadow rounded-lg p-6 border flex flex-col items-center gap-4'>
            <Typography variant='h6' textAlign='center'>
                Добавить клиента
            </Typography>
            <Typography variant='body2' textAlign='center' color='GrayText' mt={-2}>
                Клиент обязательно должен быть зарегистрирован в Ivideon
            </Typography>
            <TextField value={name} onChange={e => setName(e.target.value)} placeholder='ФИО ребенка' fullWidth type='name' />
            <TextField value={email} onChange={e => setEmail(e.target.value)} placeholder='Email родителя' fullWidth type='email' />
            <Button onClick={add}>добавить</Button>
        </Box>
    )
}

export default Create