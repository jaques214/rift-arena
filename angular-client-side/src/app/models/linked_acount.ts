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
            type: 'select',
            label: 'Rank',
            value: 'rank',
            iconlabel: 'star icon',
            icon: 'star',
            values: [
              'I', 'II', 'III', 'IV',
            ]
          },
          {
            type: 'select',
            label: 'Region',
            value: 'region',
            iconlabel: 'place icon',
            icon: 'place',
            values: [
              'br1', 'eun1', 'euw1', 'jp1', 'kr', 'la1', 'la2', 'na1', 'oc1', 'ru', 'tr1',
            ]
          },
    ]}
}
}