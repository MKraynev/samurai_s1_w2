export interface IRepo<T> {
    take(id: string): Promise< T | null>,
    takeAll(): Promise<T[]>,
    add(element: T): Promise<T | null>,
    update(id: string, elementData: T): Promise<boolean>,
    delete(id: string): Promise<boolean>
    __clear__(): Promise<boolean>;
}
