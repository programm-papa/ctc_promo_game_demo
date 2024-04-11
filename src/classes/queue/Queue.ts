import type IQueue from "../../interfaces/IQueue";

// Реализуем класс очереди
export default class Queue<T> implements IQueue<T> {
    private elements: T[];

    constructor(elements: T[]) {
        this.elements = [...elements];
    }

    next(): T | null {
        return this.elements.shift() ?? null;
    }
}
