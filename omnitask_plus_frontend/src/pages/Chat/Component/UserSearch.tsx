import React from 'react';
import { UserType } from '../types';
import { Search as SearchIcon } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchResults: UserType[]; // Updated to use UserType for a more detailed type
  loading: boolean;
  handleUserSelection: (userId: string, checked: boolean) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ searchTerm, setSearchTerm, searchResults, loading, handleUserSelection }) => {

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <TextField
        type="text"
        placeholder="Search users..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {searchResults?.map((user) => (
            <li key={user.id} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ccc' }} onClick={() => handleUserSelection(user.id, true)}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
