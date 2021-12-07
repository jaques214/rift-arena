import {User} from './user'

export class Request {
    constructor(
        public requestId: number,
        public user: User,
        public teamTag: string,
        public teamName: string,
        public accepted: boolean,
    ) {}
}