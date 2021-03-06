import {User} from './user'
import {Tournament} from './tournament'

export class Team {
    constructor (
        public teamId?: number,
        public name?: string,
        public tag?: string,
        public teamLeader?: User,
        public rank?: string,
        public numberMembers?: number,
        public wins?: number,
        public defeats?: number,
        public gamesPlayed?: number,
        public tournamentsWon?: number,
        public poster?: string,
        public members?: User[],
        public tournament?: Tournament[],
        public winrate?: number | null,
        public substitutE_MEMBERS?: number
    ) {}

    static fields(){
        return {
            inputs: [
              {
                name: 'name',
                type: 'text',
                placeholder: 'Enter Team Name',
                iconlabel: 'account circle icon',
                icon: 'account_circle',
              },
              {
                name: 'tag',
                type: 'text',
                placeholder: 'Enter Team Tag',
                iconlabel: 'code icon',
                icon: 'code',
              },
        ]}
    }
}