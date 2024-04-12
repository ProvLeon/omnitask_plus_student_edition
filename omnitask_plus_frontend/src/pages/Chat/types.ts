import type { LiteralStringForUnion } from 'stream-chat';

export type AttachmentType = {
  file_size?: number;
  [key: string]: any;
};
export type ChannelType = { demo?: string };
export type CommandType = LiteralStringForUnion;
export type EventType = {};
export type MessageType = {};
export type ReactionType = {};
export type UserType = { id: string; username: string; image?: string };

export type StreamChatGenerics = {
  attachmentType: AttachmentType;
  channelType: ChannelType;
  commandType: CommandType;
  eventType: EventType;
  messageType: MessageType;
  reactionType: ReactionType;
  userType: UserType;
  user?: UserType; // Added user property as per instructions
};
