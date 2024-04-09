import type { MouseEventHandler } from 'react';
import { ChannelList, ChannelListProps } from 'stream-chat-react';

import { MessagingChannelListHeader, MessagingChannelPreview } from '../index';
import { useThemeContext } from '../../context';
import { UserFromToken } from 'stream-chat';

type MessagingSidebarProps = {
  channelListOptions: {
    filters: ChannelListProps['filters'];
    sort: ChannelListProps['sort'];
    options: ChannelListProps['options'];
  };
  onClick: MouseEventHandler;
  onCreateChannel: () => void;
  onPreviewSelect: MouseEventHandler;
  chatToken: string;
};

const MessagingSidebar = ({
  channelListOptions,
  onClick,
  onCreateChannel,
  onPreviewSelect,
}: MessagingSidebarProps) => {
  const { themeClassName } = useThemeContext();

  return (
    <div
      className={`bg-gray-500 text-white ${themeClassName}`}
      // id='mobile-channel-list'
      onClick={onClick}
    >
      <MessagingChannelListHeader onCreateChannel={onCreateChannel} />
      {/* <UserFromToken token={chatToken}/> */}
      <ChannelList
        {...channelListOptions}
        Preview={(props) => <MessagingChannelPreview {...props} onClick={onPreviewSelect} />}
      />
    </div>
  );
};

export default MessagingSidebar;
