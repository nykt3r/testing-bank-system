export class User {
    constructor(
        public readonly id: number,
        public readonly dni: string,
        public name: string,
        public email: string
    ) {}
}