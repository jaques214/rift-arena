import {User} from './user'

export class LinkedAccount {
    constructor(
        public id?: number,
        public username?: string,
        public profileIconID?: number,
        public summonerLevel?: string,
        public rank?: string,
        public region?: string,
        public validated?: number,
        public user?: User,
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
            iconlabel: 'star icon',
            icon: 'star',
            model: 'rank',
          },
          {
            label: 'Region',
            type: "select",
            iconlabel: 'place icon',
            icon: 'place',
            model: 'region',
          },
    ]}
}
}