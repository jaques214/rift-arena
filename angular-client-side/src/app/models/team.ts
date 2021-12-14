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
        public tournamentsWon: number,
        public winrate: number | null
    ) {}

    static fields(){
        return {
            inputs: [
              {
                name: 'teamName',
                type: 'text',
                placeholder: 'Enter Team Name',
                iconlabel: 'account circle icon',
                icon: 'account_circle',
                model: undefined,
              },
              {
                name: 'tag',
                type: 'text',
                placeholder: 'Enter Team Tag',
                iconlabel: 'code icon',
                icon: 'code',
                model: undefined,
              },
        ]}
    }
}