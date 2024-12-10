import { ClientData } from '@/types';
import { TextField } from '@mui/material'
import React, { SetStateAction, useCallback, useEffect } from 'react'

const Search = ({
    setFocused, setSearchTerm, searchTerm, filteredHasComeClients, filteredOutClients
}: {
    setFocused: React.Dispatch<SetStateAction<number | null>>, setSearchTerm: (value: string) => void, searchTerm: string, filteredHasComeClients: ClientData[], filteredOutClients: ClientData[]
}) => {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
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
                        return prevFocused + 1 >= filteredHasComeClients.length + filteredOutClients.length
                            ? null
                            : prevFocused + 1;
                    }
                    return 0; // Focus the first item if focused is null
                });
            }
        },
        [setFocused, filteredHasComeClients, filteredOutClients]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [filteredHasComeClients, filteredOutClients, handleKeyDown]);

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, [])

    return (
        <TextField
            label="Поиск клиента"
            variant="outlined"
            value={searchTerm}
            onBlur={() => setFocused(null)}
            onChange={handleSearch}
        />
    )
}

export default Search