import {Team} from './team';
import { Message } from './message';
import { LinkedList } from 'linked-list-typescript';

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
        public name: string,
        public state: State,
        public stages: LinkedList<Team>,
        public rank: string,
        public date: any,
        public region: string,
        public finalWinner: string,
        public description: string,
        public prize: number,
        public minimumTier: string,
        public poster: string,
        public chat: Message[],
    ) {}

    static fields(){
        return {
            inputs: [
              {
                name: 'name',
                type: 'text',
                placeholder: 'Enter tournament name',
                iconlabel: 'category icon',
                icon: 'category',
                model: undefined,
              },
              {
                name: 'nTeams',
                type: 'number',
                placeholder: 'Enter the number of teams',
                iconlabel: 'group icon',
                icon: 'group',
                model: undefined,
              },
              {
                name: 'date',
                type: 'datetime-local',
                placeholder: 'Enter tournament date',
                iconlabel: 'today icon',
                icon: 'today',
                model: undefined,
              },
        ]}
    }
}