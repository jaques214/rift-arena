import { Tournament } from './tournament';

export class Message {
    constructor(
        public messageId: number,
        public message: string,
        public tournament: Tournament,
        public userId: number,
     ) {}
}

