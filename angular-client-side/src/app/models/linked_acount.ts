import type { FieldInput } from '../shared/utils';
import type { User } from './user';

export type LinkedAccount = {
  id?: number;
  username?: string;
  profileIconID?: number;
  summonerLevel?: number;
  rank?: string;
  region?: string;
  validated?: number;
  user?: User;
};

export const accountFields = (): FieldInput[] => [
  {
    id: 'username',
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter username',
    iconLabel: 'account circle icon',
    icon: 'account_circle',
  },
  {
    id: 'region',
    name: 'region',
    placeholder: 'Select region',
    type: 'select',
    label: 'Region',
    value: 'region',
    iconLabel: 'place icon',
    icon: 'place',
    values: ['br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'ru', 'tr1'],
  },
];
