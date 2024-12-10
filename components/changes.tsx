import { changeClientsStatus } from '@/firebase/clientApp'
import { ClientData } from '@/types'
import { Box, Button, Typography } from '@mui/material'
import React, { SetStateAction, useEffect } from 'react'

const Changes = ({
  newHasComeClients, newOutClients, setLoading, setFinished
}: {
  newHasComeClients: ClientData[], newOutClients: ClientData[], setLoading: React.Dispatch<SetStateAction<boolean>>, setFinished: React.Dispatch<SetStateAction<boolean>>
}) => {


  const submit = async () => {
    setLoading(true)
    changeClientsStatus(newHasComeClients, newOutClients)

    const grantedEmails = newHasComeClients.map(i => i.email).join(', ')
    const deniedEmails = newOutClients.map(i => i.email).join(', ')

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
  )
}

export default Changes