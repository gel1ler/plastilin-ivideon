import { denyAll } from '@/firebase/clientApp';
import { Button } from '@mui/material'
import React, { SetStateAction } from 'react'

const DenyAllClients = ({ setLoading, setFinished }: { setLoading: React.Dispatch<SetStateAction<boolean>>, setFinished: React.Dispatch<SetStateAction<boolean>> }) => {
    const denyAllClients = async () => {
        setLoading(true)
        const confirmAction = window.confirm('Вы уверены? Это действие нельзя отменить.');
        if (confirmAction) {
            denyAll()

            const response = await fetch('/api/permissions/denyAll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (response.status !== 200) {
                console.log(await response.json())
                return alert('Ошибка при отправке изменений')
            }
        }
        setFinished(true)

        setTimeout(() => {
            window.location.reload()
        }, 2000)
    }

    return (
        <>
            <Button onClick={denyAllClients} variant="outlined" color='warning'>
                Забрать права у всех (кроме админа)
            </Button>
        </>
    )
}

export default DenyAllClients