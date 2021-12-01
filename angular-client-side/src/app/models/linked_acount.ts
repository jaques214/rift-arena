import {User} from './user'

export class LinkedAccount {
    constructor(
        public id: number,
        public username: string,
        public rank: string,
        public region: string,
        public user: User,
    ) {}
}