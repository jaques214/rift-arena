import {User} from './user'
import {Tournament} from './tournament'

export class Team {
    constructor (
        public teamId: number,
        public tag: string,
        public name: string,
        public rank: string,
        public teamLeader: User,
        public numberMembers: number,
        public wins: number,
        public defeats: number,
        public gamesPlayed: number,
        public members: User[],
        public poster: string,
        public tournament: Tournament[],
        public tournamentsWon: number
    ) {}

    static fields(){
        return {
            inputs: [
              {
                name: 'nickname',
                type: 'text',
                placeholder: 'Enter Account nickname',
                iconlabel: 'account circle icon',
                icon: 'account_circle',
                model: undefined,
              },
              {
                name: 'email',
                type: 'text',
                placeholder: 'Enter email',
                iconlabel: 'email icon',
                icon: 'email',
                model: undefined,
              },
              {
                name: 'password',
                type: 'text',
                placeholder: 'Enter password',
                iconlabel: 'no encryption icon',
                icon: 'no_encryption',
                model: undefined,
              },
        ]}
    }
}