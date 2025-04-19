export interface EventBus<Events extends Record<string, (...args: any[]) => any>> {
    on<K extends keyof Events>(event: K, listener: Events[K]): void;
    off<K extends keyof Events>(event: K, listener: Events[K]): void;
    once<K extends keyof Events>(event: K, listener: Events[K]): void;
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void;
}
