import type { LinkedAccount } from './linked_acount';

export type User = {
  token?: string;
  userID?: number;
  nickname?: string;
  email?: string;
  password?: string;
  poster?: string;
  rank?: string;
  teamTag: string | null;
  linkedAccount?: LinkedAccount;
  requests?: Request[];
  teamId?: number;
};

export const loginFields = () => [
  {
    id: 'nickname',
    name: 'nickname',
    type: 'text',
    label: 'Account Nickname',
    placeholder: 'Enter Account nickname',
    iconLabel: 'account circle icon',
    icon: 'account_circle',
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    iconLabel: 'no encryption icon',
    icon: 'no_encryption',
  },
];

export const registerFields = () => [
  {
    id: 'nickname',
    name: 'nickname',
    type: 'text',
    label: 'Account Nickname',
    placeholder: 'Enter Account nickname',
    iconLabel: 'account circle icon',
    icon: 'account_circle',
  },
  {
    id: 'email',
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    iconLabel: 'email icon',
    icon: 'email',
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    iconLabel: 'no encryption icon',
    icon: 'no_encryption',
  },
  {
    id: 'new_password',
    name: 'new_password',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Enter password again',
    iconLabel: 'no encryption icon',
    icon: 'no_encryption',
  },
];

export const userFields = () => [
  {
    id: 'email',
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter email',
    iconLabel: 'email icon',
    icon: 'email',
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    iconLabel: 'no encryption icon',
    icon: 'no_encryption',
  },
];

export const passwordFields = () => [
  {
    id: 'password',
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    iconLabel: 'no encryption icon',
    icon: 'no_encryption',
  },
  {
    id: 'new_password',
    name: 'new_password',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Enter password again',
    iconLabel: 'no encryption icon',
    icon: 'no_encryption',
  },
];
