export class Message {
    constructor(
      public readonly id: string,
      public readonly userId: string,
      public readonly channel: string,
      public readonly content: string,
      public readonly createdAt: Date = new Date(),
    ) {}
  }
  