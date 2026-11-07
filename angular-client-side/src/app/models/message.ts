import type { Tournament } from './tournament';

export type Message = {
  messageId: number;
  message: string;
  tournament: Tournament;
  userId: number;
};
