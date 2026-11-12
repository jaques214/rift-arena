import type { FieldInput } from '@shared/utils';
import type { Tournament } from './tournament';
import type { User } from './user';

export type Team = {
  teamId?: number;
  name: string;
  tag: string;
  teamLeader?: User;
  rank?: string;
  numberMembers: number;
  wins?: number;
  defeats?: number;
  gamesPlayed?: number;
  tournamentsWon?: number;
  poster: string;
  members?: User[];
  tournament?: Tournament[];
  winrate?: number | null;
  substituteMembers?: number;
};
export const teamFields = (): FieldInput[] => [
  {
    id: 'name',
    name: 'name',
    type: 'text',
    placeholder: 'Enter Team Name',
    iconLabel: 'account circle icon',
    icon: 'account_circle',
    label: 'Team Name',
  },
  {
    id: 'tag',
    name: 'tag',
    type: 'text',
    placeholder: 'Enter Team Tag',
    iconLabel: 'code icon',
    icon: 'code',
    label: 'Team Tag',
  },
];
