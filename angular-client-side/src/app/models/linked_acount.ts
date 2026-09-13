import {User} from './user'

export class LinkedAccount {
    constructor(
        public id?: number,
        public username?: string,
        public profileIconID?: number,
        public summonerLevel?: number,
        public rank?: string,
        public region?: string,
        public validated?: number,
        public user?: User,
    ) {}

static fields(){
    return {
        inputs: [
          {
            id: "username",
            name: 'username',
            type: 'text',
            label: 'Username',
            placeholder: 'Enter username',
            iconLabel: 'account circle icon',
            icon: 'account_circle',
            model: 'username',
          },
          {
            id: "region",
            type: 'select',
            label: 'Region',
            value: 'region',
            iconLabel: 'place icon',
            icon: 'place',
            values: [
              'br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'ru', 'tr1',
            ]
          },
    ]}
}
}
