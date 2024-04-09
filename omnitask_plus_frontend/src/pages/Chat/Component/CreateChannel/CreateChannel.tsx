import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import type { UserResponse } from 'stream-chat';
import _debounce from 'lodash.debounce';

import { XButton, XButtonBackground } from '../../assets';

import './CreateChannel.css';

import type { StreamChatGenerics } from '../../types';

const UserResult = ({ user }: { user: UserResponse<StreamChatGenerics> }) => (
  <li className='flex items-center gap-4 h-14 cursor-pointer p-2'>
    <Avatar image={user.image} name={user.name} size={40} />
    {user.online && <div className='absolute right-7 bottom-3.5 bg-green-500 rounded-full h-4 w-4 border-2 border-white dark:border-gray-800' />}
    <div className='flex flex-col'>
      <span>{user.name}</span>
    </div>
  </li>
);

type Props = {
  onClose: () => void;
  toggleMobile: () => void;
};

const CreateChannel = (props: Props) => {
  const { onClose, toggleMobile } = props;

  const { client, setActiveChannel } = useChatContext<StreamChatGenerics>();

  const [focusedUser, setFocusedUser] = useState<number>();
  const [inputText, setInputText] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserResponse<StreamChatGenerics>[]>([]);
  const [users, setUsers] = useState<UserResponse<StreamChatGenerics>[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const clearState = () => {
    setInputText('');
    setResultsOpen(false);
    setSearchEmpty(false);
  };

  useEffect(() => {
    const clickListener = () => {
      if (resultsOpen) clearState();
    };

    document.addEventListener('click', clickListener);

    return () => document.removeEventListener('click', clickListener);
  }, [resultsOpen]);

  const findUsers = async () => {
    if (searching) return;
    setSearching(true);

    try {
      const response = await client.queryUsers(
        {
          id: { $ne: client.userID as string },
          $and: [{ name: { $autocomplete: inputText } }],
        },
        { id: 1 },
        { limit: 6 },
      );

      if (!response.users.length) {
        setSearchEmpty(true);
      } else {
        setSearchEmpty(false);
        setUsers(response.users);
      }

      setResultsOpen(true);
    } catch (error) {
      console.log({ error });
    }

    setSearching(false);
  };

  const findUsersDebounce = _debounce(findUsers, 100, {
    trailing: true,
  });

  useEffect(() => {
    if (inputText) {
      findUsersDebounce();
    }
  }, [inputText]); // eslint-disable-line react-hooks/exhaustive-deps

  const createChannel = async () => {
    const selectedUsersIds = selectedUsers.map((u) => u.id);

    if (!selectedUsersIds.length || !client.userID) return;

    const conversation = client.channel('messaging', {
      members: [...selectedUsersIds, client.userID],
    });

    await conversation.watch();

    setActiveChannel?.(conversation);
    setSelectedUsers([]);
    setUsers([]);
    onClose();
  };

  const addUser = (addedUser: UserResponse<StreamChatGenerics>) => {
    const isAlreadyAdded = selectedUsers.find((user) => user.id === addedUser.id);
    if (isAlreadyAdded) return;

    setSelectedUsers([...selectedUsers, addedUser]);
    setResultsOpen(false);
    setInputText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeUser = (user: UserResponse<StreamChatGenerics>) => {
    const newUsers = selectedUsers.filter((item) => item.id !== user.id);
    setSelectedUsers(newUsers);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // check for up(ArrowUp) or down(ArrowDown) key
      if (event.key === 'ArrowUp') {
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === 0 ? users.length - 1 : prevFocused - 1;
        });
      }
      if (event.key === 'ArrowDown') {
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === users.length - 1 ? 0 : prevFocused + 1;
        });
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        if (focusedUser !== undefined) {
          addUser(users[focusedUser]);
          return setFocusedUser(undefined);
        }
      }
    },
    [users, focusedUser], // eslint-disable-line
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className='absolute  z-10 flex flex-col w-full  dark:bg-gray-800 shadow-md rounded-t-lg'>
      <header className='flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-t-lg'>
        <div className='flex flex-1 items-center'>
          <div className='text-lg text-gray-600 dark:text-white opacity-50 mr-2'>To:</div>
          <div className='flex flex-1 flex-wrap items-center'>
            {!!selectedUsers?.length && (
              <div className='flex flex-wrap max-w-full'>
                {selectedUsers.map((user) => (
                  <div
                    className='flex justify-between items-center w-auto h-6 bg-blue-400 dark:bg-gray-600 text-white dark:text-white p-2 rounded-full cursor-pointer mr-2 mb-2'
                    onClick={() => removeUser(user)}
                    key={user.id}
                  >
                    <div className='text-sm mr-2'>{user.name}</div>
                    <XButton />
                  </div>
                ))}
              </div>
            )}
            <form className='flex-1'>
              <input
                autoFocus
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={!selectedUsers.length ? 'Start typing for suggestions' : ''}
                type='text'
                className='bg-transparent outline-none w-full'
              />
            </form>
          </div>
          <div className='ml-2 cursor-pointer' onClick={() => toggleMobile()}>
            <XButtonBackground />
          </div>
        </div>
        <button className='text-white bg-blue-500 hover:bg-blue-700 rounded-full px-4 py-1' onClick={createChannel}>
          Start chat
        </button>
      </header>
      {inputText && (
        <main>
          <ul className='flex flex-col max-w-md bg-gray-200 dark:bg-gray-600 opacity-90 shadow-md rounded-lg overflow-y-auto list-none p-0 m-1'>
            {!!users?.length && !searchEmpty && (
              <div>
                {users.map((user, i) => (
                  <div
                    className={`flex items-center ${focusedUser === i ? 'bg-white dark:bg-gray-700' : ''}`}
                    onClick={() => addUser(user)}
                    key={user.id}
                  >
                    <UserResult user={user} />
                  </div>
                ))}
              </div>
            )}
            {searchEmpty && (
              <div
                onClick={() => {
                  inputRef.current?.focus();
                  clearState();
                }}
                className='text-gray-600 dark:text-white p-2 cursor-pointer'
              >
                No people found...
              </div>
            )}
          </ul>
        </main>
      )}
    </div>
  );
};

export default React.memo(CreateChannel);
