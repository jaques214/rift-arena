import { LinkedAccount } from './linked_acount';

export class User {
  constructor(
    public token?: string,
    public userID?: number,
    public nickname?: string,
    public email?: string,
    public password?: string,
    public poster?: string,
    public rank?: string,
    public teamTag?: string,
    public linkedAccount?: LinkedAccount,
    public requests?: Request[],
    public teamId?: number
  ) { }

  static loginFields() {
    return {
      inputs: [
        {
          id: "nickname",
          name: 'nickname',
          type: 'text',
          label: 'Account Nickname',
          placeholder: 'Enter Account nickname',
          iconLabel: 'account circle icon',
          icon: 'account_circle',
          model: 'nickname',
        },
        {
          id: "password",
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Enter password',
          iconLabel: 'no encryption icon',
          icon: 'no_encryption',
          // model: 'password',
        },
      ],
    };
  }

  static registerFields() {
    return {
      inputs: [
        {
          id: "nickname",
          name: 'nickname',
          type: 'text',
          label: 'Account Nickname',
          placeholder: 'Enter Account nickname',
          iconLabel: 'account circle icon',
          icon: 'account_circle',
          model: 'nickname',
        },
        {
          id: "email",
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Enter email',
          iconLabel: 'email icon',
          icon: 'email',
          model: 'email',
        },
        {
          id: "password",
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Enter password',
          iconLabel: 'no encryption icon',
          icon: 'no_encryption',
          // model: 'password',
        },
        {
          id: "new_password",
          name: 'new_password',
          type: 'password',
          label: 'Confirm Password',
          placeholder: 'Enter password again',
          iconLabel: 'no encryption icon',
          icon: 'no_encryption',
          // model: 'password',
        },
      ],
    };
  }

  static fields() {
    return {
      inputs: [
        {
          id: "email",
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Enter email',
          iconLabel: 'email icon',
          icon: 'email',
          // model: 'email',
        },
        {
          id: "password",
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Enter password',
          iconLabel: 'no encryption icon',
          icon: 'no_encryption',
          // model: 'password',
        },
      ],
    };
  }

  static passwordFields() {
    return {
      inputs: [
        {
          id: "password",
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Enter password',
          iconLabel: 'no encryption icon',
          icon: 'no_encryption',
          // model: 'password',
        },
        {
          id: "new_password",
          name: 'new_password',
          type: 'password',
          label: 'Confirm Password',
          placeholder: 'Enter password again',
          iconLabel: 'no encryption icon',
          icon: 'no_encryption',
          // model: 'password',
        },
      ],
    };
  }
}
