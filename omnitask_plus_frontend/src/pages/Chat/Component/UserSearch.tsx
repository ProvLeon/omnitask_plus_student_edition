import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserType } from '../types';

const UserSearch = () => {
  const { client } = useChatContext();
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (search) {
        const response = await client.queryUsers({ name: { $autocomplete: search } }, { id: 1 }, { limit: 10 });
        if (response.users) {
          setUsers(response.users.map(user => ({
            ...user,
            name: user.name || 'Unnamed User'
          })));
        }
      } else {
        setUsers([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, client]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
