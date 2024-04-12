// import './MessagingChannelPreview.css';
import {
  ChannelPreviewUIComponentProps,
  ChatContextValue,
  useChatContext,
} from 'stream-chat-react';
import { AvatarGroup } from '..';

import type { MouseEventHandler} from 'react';
import type { Channel, ChannelMemberResponse } from 'stream-chat';
import type { StreamChatGenerics } from '../../types';

const getTimeStamp = (channel: Channel) => {
  let lastHours = channel.state.last_message_at?.getHours();
  let lastMinutes: string | number | undefined = channel.state.last_message_at?.getMinutes();
  let half = 'AM';

  if (lastHours === undefined || lastMinutes === undefined) {
    return '';
  }

  if (lastHours > 12) {
    lastHours = lastHours - 12;
    half = 'PM';
  }

  if (lastHours === 0) lastHours = 12;
  if (lastHours === 12) half = 'PM';

  if (lastMinutes.toString().length === 1) {
    lastMinutes = `0${lastMinutes}`;
  }

  return `${lastHours}:${lastMinutes} ${half}`;
};

const getChannelName = (members: ChannelMemberResponse[]) => {
  const defaultName = 'Johnny Blaze';

  if (!members.length || members.length === 1) {
    return members[0]?.user?.username || defaultName;
  }

  return `${members[0]?.user?.username || defaultName}, ${members[1]?.user?.username || defaultName}`;
};

type MessagingChannelPreviewProps = ChannelPreviewUIComponentProps & {
  channel: Channel;
  onClick: MouseEventHandler;
  setActiveChannel?: ChatContextValue['setActiveChannel'];
};

const MessagingChannelPreview = (props: MessagingChannelPreviewProps) => {
  const { channel, setActiveChannel, onClick, latestMessage, } = props;
  const { channel: activeChannel, client } = useChatContext<StreamChatGenerics>();

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID,
  );



  return (
    <div
      className={`flex flex-row items-center p-2 cursor-pointer ${
        channel?.id === activeChannel?.id ? 'bg-white shadow transition-colors duration-100 ease-in-out' : ''
      } hover:bg-white hover:shadow-lg`}
      onClick={(e) => {
        onClick(e);
        setActiveChannel?.(channel);
      }}
    >
      <AvatarGroup members={members as ChannelMemberResponse<StreamChatGenerics>[]} />
      <div className='flex flex-col ml-2 mr-2 md:w-full w-auto'>
        <div className='flex gap-5 sm:gap-10 md:gap-auto'>
          <p className=' text-sm font-bold text-black md:flex-grow  truncate'>
            {channel.data?.name || getChannelName(members)}
          </p>
          <p className='text-xs text-gray-500'>{getTimeStamp(channel)}</p>
        </div>
        <div className='text-sm text-gray-500 truncate'>{latestMessage}</div>
      </div>
    </div>
  );
};

export default MessagingChannelPreview;
