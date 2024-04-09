import React, { useEffect, useRef, useState } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
// import './MessagingChannelHeader.css';

import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
import { ChannelInfoIcon, ChannelSaveIcon, HamburgerIcon } from '../../assets';
import { AvatarGroup } from '..';

import type { StreamChatGenerics } from '../../types';

type Props = {
  theme: string;
  toggleMobile: () => void;
};

const MessagingChannelHeader = (props: Props) => {
  const { theme, toggleMobile } = props;
  const { client } = useChatContext<StreamChatGenerics>();
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const [channelName, setChannelName] = useState(channel.data?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const members = Object.values(channel.state.members || {}).filter(
    (member) => member.user?.id !== client?.user?.id,
  );

  const updateChannel = async () => {
    if (channelName && channelName !== channel.data?.name) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` },
      );
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef?.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!channelName) {
      setTitle(
        members.map((member) => member.user?.name || member.user?.id || 'Unnamed User').join(', '),
      );
    }
  }, [channelName, members]);

  const EditHeader = () => (
    <form
      className="flex flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        inputRef?.current?.blur();
      }}
    >
      <input
        autoFocus
        className='channel-header__edit-input'
        onBlur={updateChannel}
        onChange={(event) => setChannelName(event.target.value)}
        placeholder='Type a new name for the chat'
        ref={inputRef}
        value={channelName}
      />
    </form>
  );

  return (
    <div className='flex flex-row items-center p-2 gap-2 shadow-lg border-b-2 border-opacity-10 rounded-md bg-white' style={{ boxShadow: '0 8px 10px -5px rgba(0, 0, 0, 0.2), 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12)' }}>
      <div id='' className={`${theme} hover:bg-gray-100 p-2 rounded-full cursor-pointer`} onClick={() => toggleMobile()}>
        <HamburgerIcon />
      </div>
      <AvatarGroup members={members} />
      <div className='flex-grow'>
        {!isEditing ? (
          <div className='channel-header__name'>{channelName || title}</div>
        ) : (
          <EditHeader />
        )}
      </div>
      <div className='p-5'>
        <TypingIndicator />
        {channelName !== 'Social Demo' &&
          (!isEditing ? <ChannelInfoIcon {...{ isEditing, setIsEditing }} /> : <ChannelSaveIcon />)}
      </div>
    </div>
  );
};

export default React.memo(MessagingChannelHeader);
