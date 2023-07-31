export interface IRepo<T> {
    take(id: string): T[] | T | null,
    add(element: T): T | null,
    update(id: string, elementData: T): boolean,
    delete(id: string): boolean
}
