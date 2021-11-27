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