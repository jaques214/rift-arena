import type { Team } from './team';
import type { Message } from './message';

export enum State {
  PUBLISHED,
  NOT_PUBLISHED,
  CANCELED,
  SOON,
  ONLINE,
  CLOSED,
}

export type Tournament = {
  tournamentId: number;
  numberOfTeams: number;
  maxTeams: number;
  name: string;
  state: State;
  stages: Team[];
  rank: string;
  date: any;
  region: string;
  finalWinner: string;
  description: string;
  prize: number;
  poster: string;
  chat: Message[];
};

export const tournamentFields = () => [
  {
    id: 'name',
    name: 'name',
    type: 'text',
    placeholder: 'Enter tournament name',
    iconLabel: 'category icon',
    icon: 'category',
  },
  {
    id: 'nTeams',
    name: 'nTeams',
    type: 'number',
    placeholder: 'Enter the number of teams',
    iconLabel: 'group icon',
    icon: 'group',
  },
  {
    id: 'date',
    name: 'date',
    type: 'datetime-local',
    placeholder: 'Enter tournament date',
    iconLabel: 'today icon',
    icon: 'today',
  },
];
