class Node {
    constructor(v) {
        this.value = v;
        this.nxt = null;
        this.pre = null;
    }
}

export class CycleList {
    constructor(...args) {
        if(args.length === 0) throw new Error('CycleList must have at least one argument');

        let cur = new Node(null);
        let prev = new Node(null);
        args.forEach(
            (e, i) => {
                if (i === 0) {
                    this.head = new Node(e);
                    this.tail = this.head;
                    cur = this.head;
                    return;
                }

                cur.nxt = new Node(e);
                cur.pre = prev
                prev = cur;
                cur = cur.nxt;

                if (i === args.length - 1) {
                    cur.nxt = this.head;
                    cur.pre = prev;
                    this.head.pre = cur;
                    this.tail = cur;
                }
            }
        )
    }
}

/*const list = new CycleList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

for (let i = list.tail; true; i=i.pre) {
    console.log(i.value);

    if (i === list.head) break;
}*/
