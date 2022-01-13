import { Team } from './team';
import {User} from './user'

export class Request {
    constructor(
        public requestId: number,
        public user: User,
        public teamTag: string,
        public team: Team,
        public accepted: boolean,
    ) {}
}