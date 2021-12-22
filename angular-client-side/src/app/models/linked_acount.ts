import {User} from './user'

export class LinkedAccount {
    constructor(
        public id: number,
        public username: string,
        public rank: string,
        public region: string,
        public user: User,
    ) {}

static fields(){
    return {
        inputs: [
          {
            name: 'username',
            type: 'text',
            label: 'Username',
            placeholder: 'Enter username',
            iconlabel: 'account circle icon',
            icon: 'account_circle',
            model: 'username',
          },
          {
            name: 'rank',
            type: 'text',
            label: 'Rank',
            placeholder: 'Choose rank',
            iconlabel: 'no encryption icon',
            icon: 'no_encryption',
            model: 'rank',
          },
          {
            label: 'Region',
            type: "select",
            iconlabel: 'place icon',
            icon: 'place',
          },
    ]}
}
}