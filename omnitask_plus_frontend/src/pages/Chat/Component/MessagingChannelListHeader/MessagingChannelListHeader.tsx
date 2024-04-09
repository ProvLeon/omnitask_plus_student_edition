import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { CreateChannelIcon } from '../../assets';
import streamLogo from '../../assets/stream.png';

import type { StreamChatGenerics } from '../../types';

type Props = {
  onCreateChannel?: () => void;
};

const MessagingChannelListHeader = React.memo((props: Props) => {
  const { onCreateChannel } = props;

  const { client } = useChatContext<StreamChatGenerics>();

  const { id, image = streamLogo as string, username = 'Example User' } = client.user || {};

  return (
      <div className='flex p-4 items-center justify-between'>
        <div className='flex items-center'>
          <div className='w-10 h-10 rounded-full border border-gray-400 overflow-hidden'>
            <Avatar image={image} name={username} size={40} />
          </div>
          <div className={`messaging__channel-list__header__name ml-4`}>{username || id}</div>
        </div>
        <button
          className='ml-auto bg-gray-700 rounded-full p-2 hover:bg-gray-800'
          onClick={onCreateChannel}
        >
          <CreateChannelIcon />
        </button>
      </div>
  );
});

export default React.memo(MessagingChannelListHeader);
