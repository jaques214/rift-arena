export class User {
    constructor (
        public userId: number,
        public nickname: string,
        public email: string,
        public password: string,
        public name: string,
        public profileImage: string,
        public rank: string,
        //public team: Team,
        //public linkedAccount: LinkedAccount,
        requests: Request[]
    ) {}

    static fields(){
        return {
            inputs: [
              {
                name: 'nickname',
                type: 'text',
                placeholder: 'Enter Account nickname',
                iconlabel: 'streetview icon',
                icon: 'streetview',
                model: undefined,
              },
              {
                name: 'email',
                type: 'text',
                placeholder: 'Enter email',
                iconlabel: 'streetview icon',
                icon: 'streetview',
                model: undefined,
              },
              {
                name: 'password',
                type: 'text',
                placeholder: 'Enter password',
                iconlabel: 'place icon',
                icon: 'place',
                model: undefined,
              },
        ]}
    }
}