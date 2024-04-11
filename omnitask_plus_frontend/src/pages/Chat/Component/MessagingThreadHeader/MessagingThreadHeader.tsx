import type { ThreadHeaderProps } from 'stream-chat-react';

// import './MessagingThreadHeader.css';

import { CloseThreadIcon } from '../../assets';

const MessagingThreadHeader = ({ closeThread, thread }: ThreadHeaderProps) => {
  const getReplyCount = () => {
    if (!thread?.reply_count) return '';
    if (thread.reply_count === 1) return '1 reply';
    return `${thread.reply_count} Replies`;
  };

  return (
    <div className='flex p-4 items-center'>
      <div className='flex flex-col'>
        <p className='custom-thread-header__left-title'>Thread</p>
        <p className='custom-thread-header__left-count'>{getReplyCount()}</p>
      </div>
      <div className='ml-auto'>
        <CloseThreadIcon closeThread={closeThread} />
      </div>
    </div>
  );
};

export default MessagingThreadHeader;
