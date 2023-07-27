export interface IRepo<T> {
    take(id?: number): T[] | T | null,
    add(element: T): T,
    update(id: number, elementData: T): boolean,
    delete(id: number): boolean
}
