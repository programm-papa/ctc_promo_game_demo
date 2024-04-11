export default interface IQueue<T> {
    next(): T | null;
}