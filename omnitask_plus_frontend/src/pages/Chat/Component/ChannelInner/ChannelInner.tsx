import React from 'react';
import { logChatPromiseExecution } from 'stream-chat';
import {
  MessageList,
  MessageInput,
  MessageToSend,
  Window,
  useChannelActionContext,
  Thread,
} from 'stream-chat-react';

import { MessagingChannelHeader } from '..';
import { useGiphyContext } from '../../context';
import type { StreamChatGenerics } from '../../types';

export type ChannelInnerProps = {
  toggleMobile: () => void;
  theme: string;
};

const ChannelInner = (props: ChannelInnerProps) => {
  const { theme, toggleMobile } = props;
  const { giphyState, setGiphyState } = useGiphyContext();

  const { sendMessage } = useChannelActionContext<StreamChatGenerics>();

  const overrideSubmitHandler = (message: MessageToSend<StreamChatGenerics>) => {
    let updatedMessage;

    if (message.attachments?.length && message.text?.startsWith('/giphy')) {
      const updatedText = message.text.replace('/giphy', '');
      updatedMessage = { ...message, text: updatedText };
    }

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...message, text: updatedText };
    }

    if (sendMessage) {
      const newMessage = updatedMessage || message;
      const parentMessage = newMessage.parent;

      const messageToSend = {
        ...newMessage,
        parent: parentMessage
          ? {
              ...parentMessage,
              created_at: parentMessage.created_at?.toString(),
              pinned_at: parentMessage.pinned_at?.toString(),
              updated_at: parentMessage.updated_at?.toString(),
            }
          : undefined,
      };

      const sendMessagePromise = sendMessage(messageToSend);
      logChatPromiseExecution(sendMessagePromise, 'send message');
    }

    setGiphyState(false);
  };

  const actions = ['delete', 'edit', 'flag', 'markUnread', 'mute', 'react', 'reply'];

  const renderUsername = (message) => {
    return message.user?.name || message.user?.id;
  };

  return (
    <div className='flex h-[90%] w-full'>
      <Window>
        <MessagingChannelHeader theme={theme} toggleMobile={toggleMobile} />
        <div className='flex flex-col overflow-y-auto'>
        <MessageList messageActions={actions} />
        </div>
        <MessageInput focus overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread />
    </div>
  );
};

export default ChannelInner;
