import  { useEffect, useState } from 'react';
import type { ChannelMemberResponse } from 'stream-chat';
import { Avatar } from 'stream-chat-react';
import { getCleanImage } from '../../assets';
import StreamLogo from '../../assets/stream.png';
import {StreamChatGenerics} from '../../types'

export const AvatarGroup = ({ members }: { members: ChannelMemberResponse<StreamChatGenerics>[] }) => {
  const [image, setImage] = useState<string[] | undefined>([]);

  useEffect(() => {
    const loadImage = async () => {
      if (members.length === 1) {
        const img = await getCleanImage(members[0]);
        setImage([img]);
      } else if (members.length === 2) {
        const img1 = await getCleanImage(members[0]);
        const img2 = await getCleanImage(members[1]);
        setImage([img1, img2]);
      } else if (members.length >= 3) {
        const img1 = await getCleanImage(members[0]);
        const img2 = await getCleanImage(members[1]);
        const img3 = await getCleanImage(members[2]);
        setImage([img1, img2, img3]);
      } else if (members.length >= 4) {
        const img1 = await getCleanImage(members[0]);
        const img2 = await getCleanImage(members[1]);
        const img3 = await getCleanImage(members[2]);
        const img4 = await getCleanImage(members[3]);
        setImage([img1, img2, img3, img4]);
      } else {
        // Handle other cases or set a default image
        setImage([StreamLogo]);
      }
    };
    loadImage();
  }, [members]);

  let content = <></>
  if (image && image.length > 0) {
  if (image.length === 1) {
    content = <Avatar image={image[0]} shape='square' size={40} />;
  }
  console.log(members)

  if (members.length === 2) {
    content = (
      <div className="flex">
        <div className="mr-1">
          <Avatar image={image[0]} shape='square' size={40} />
        </div>
        <div className="ml-1">
          <Avatar image={image[1]} shape='square' size={40} />
        </div>
      </div>
    );
  }

  if (members.length === 3) {
    content = (
      <div className="flex">
        <div className="mr-1">
          <Avatar image={image[0]} shape='square' size={40} />
        </div>
        <div className="flex flex-col ml-1">
          <Avatar image={image[1]} shape='square' size={20} />
          <Avatar image={image[2]} shape='square' size={20} />
        </div>
      </div>
    );
  }

  if (members.length >= 4) {
    content = (
      <div className="flex">
        <div className="flex flex-col mr-1">
          <Avatar image={image[0]} shape='square' size={20} />
          <Avatar image={image[1]} shape='square' size={20} />
        </div>
        <div className="flex flex-col ml-1">
          <Avatar image={image[2]} shape='square' size={20} />
          <Avatar image={image[3]} shape='square' size={20} />
        </div>
      </div>
    );
  }}

  // fallback for channels with no avatars (single-user channels)
  return (
    <div className='flex items-center h-10 min-w-10 max-w-10 overflow-hidden rounded-full'>
      {content}
    </div>
  );
};

export default AvatarGroup;
