import {Team} from './team';
import { Message } from './message';

export enum State {
    PUBLISHED,
    NOT_PUBLISHED,
    CANCELED,
    SOON,
    ONLINE,
    CLOSED
}

export class Tournament {
    constructor(
        public tournamentId: number,
        public numberOfTeams: number,
        public maxTeams: number,
        public name: string,
        public state: State,
        public stages: Team[],
        public rank: string,
        public date: any,
        public region: string,
        public finalWinner: string,
        public description: string,
        public prize: number,
        public poster: string,
        public chat: Message[],
    ) {}

    static fields(){
        return {
            inputs: [
              {
                id: "name",
                name: 'name',
                type: 'text',
                placeholder: 'Enter tournament name',
                iconLabel: 'category icon',
                icon: 'category',
                model: undefined,
              },
              {
                id: "nTeams",
                name: 'nTeams',
                type: 'number',
                placeholder: 'Enter the number of teams',
                iconLabel: 'group icon',
                icon: 'group',
                model: undefined,
              },
              {
                id: "date",
                name: 'date',
                type: 'datetime-local',
                placeholder: 'Enter tournament date',
                iconLabel: 'today icon',
                icon: 'today',
                model: undefined,
              },
        ]}
    }
}
