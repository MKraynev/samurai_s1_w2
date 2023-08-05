export interface IRepo<T> {
    take(id?: string): Promise<T[] | T | null>,
    add(element: T): Promise<T | null>,
    update(id: string, elementData: T): Promise<boolean>,
    delete(id: string): Promise<boolean>
    __clear__(): Promise<boolean>;
}
