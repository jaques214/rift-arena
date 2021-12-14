import {Team} from './team';
import { LinkedAccount } from './linked_acount';

export class User {
    constructor (
        public token?:string,
        public userId?: number,
        public nickname?: string ,
        public email?: string,
        public password?: string,
        public profileImage?: File,
        public rank?: string,
        public team?: Team,
        public linkedAccount?: LinkedAccount,
        public requests?: Request[]
    ) {}

    static loginFields(){
        return {
            inputs: [
              {
                name: 'nickname',
                type: 'text',
                label: 'Account Nickname',
                placeholder: 'Enter Account nickname',
                iconlabel: 'account circle icon',
                icon: 'account_circle',
                model: 'nickname',
              },
              {
                name: 'password',
                type: 'password',
                label: 'Password',
                placeholder: 'Enter password',
                iconlabel: 'no encryption icon',
                icon: 'no_encryption',
                model: 'password',
              },
        ]}
    }

    static registerFields(){
      return {
          inputs: [
            {
              name: 'nickname',
              type: 'text',
              label: 'Account Nickname',
              placeholder: 'Enter Account nickname',
              iconlabel: 'account circle icon',
              icon: 'account_circle',
              model: 'nickname',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email',
              placeholder: 'Enter email',
              iconlabel: 'email icon',
              icon: 'email',
              model: 'email',
            },
            {
              name: 'password',
              type: 'password',
              label: 'Password',
              placeholder: 'Enter password',
              iconlabel: 'no encryption icon',
              icon: 'no_encryption',
              model: 'password',
            },
            {
              name: 'confirm-password',
              type: 'password',
              label: 'Confirm Password',
              placeholder: 'Enter password again',
              iconlabel: 'no encryption icon',
              icon: 'no_encryption',
              model: 'password',
            },
      ]}
  }
}