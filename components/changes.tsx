import { changeClientsStatus } from '@/firebase/clientApp'
import { ClientData } from '@/types'
import { Box, Button, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DoneIcon from '@mui/icons-material/Done';

const Changes = ({
  newHasComeClients, newOutClients
}: {
  newHasComeClients: ClientData[], newOutClients: ClientData[]
}) => {
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const submit = async () => {
    setLoading(true)
    changeClientsStatus(newHasComeClients, newOutClients)

    const grantedEmails = newHasComeClients.map(i => i.email).join(', ')
    const deniedEmails = newOutClients.map(i => i.email).join(', ')

    console.log(grantedEmails, deniedEmails)

    const response = await fetch('/api/permissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ grantedEmails, deniedEmails })
    })

    if (response.status !== 200) {
      console.log(await response.json())
      return alert('Ошибка при отправке изменений')
    }

    setFinished(true)

    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        submit()
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  })

  return (
    <>
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
      <Box
        className='shadowed flex-col gap-2 p-4 rounded-md top-1/3 left-4'
        sx={{
          display: newOutClients.length || newHasComeClients.length ? 'flex' : 'none',
          position: ['static', 'static', 'static', 'static', 'fixed']
        }}
      >
        <Typography textAlign='center' variant='h6'>Изменения</Typography>
        {newHasComeClients.length ?
          <>
            <Typography fontWeight='bold'>Пришли: </Typography>
            <ul>
              {newHasComeClients.map((client, index) =>
                <li key={index}>
                  <Typography>{client.childName}</Typography>
                </li>
              )}
            </ul>
          </>
          : null}

        {newOutClients.length ?
          <>
            <Typography fontWeight='bold'>Ушли: </Typography>
            <ul>
              {newOutClients.map((client, index) =>
                <li key={index}>
                  <Typography>{client.childName}</Typography>
                </li>
              )}
            </ul>
          </>
          : null}

        {/* {newOutClients.length ? <Typography>Ушли: {newOutClients.map((client, index) => client.childName + (index !== newOutClients.length - 1 ? ', ' : ''))}</Typography> : null} */}
        <Button variant='outlined' sx={{ p: '4px 10px' }} onClick={submit}>
          Отправить изменения
        </Button>
      </Box >
    </>
  )
}

export default Changes