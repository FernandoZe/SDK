
export interface CommandHandler {
    handle(object: object): Promise<any>;
}
