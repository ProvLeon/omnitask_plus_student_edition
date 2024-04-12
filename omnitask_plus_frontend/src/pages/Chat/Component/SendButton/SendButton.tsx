import { SendIcon } from '../../assets';
import type { SendButtonProps } from 'stream-chat-react';

const SendButton = ({sendMessage, ...rest}: SendButtonProps) => (
  <button
    className='str-chat__send-button'
    onClick={sendMessage}
    type='button'
    {...rest}
  >
    <SendIcon />
  </button>
);

export default SendButton;
