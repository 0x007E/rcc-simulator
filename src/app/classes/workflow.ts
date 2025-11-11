import { Final } from "./final";
import { Initial } from "./initial";
import { Sequence } from "./sequence";

export class Workflow {
    private initial: Initial;
    private sequence: Sequence[];
    private final: Final;

    constructor(jsonData: any) {
        this.initial = jsonData.Initial as Initial;
        this.sequence = jsonData.Sequence as Sequence[];
        this.final = jsonData.Final as Final;
    }

    public get Initial(): Initial {
        return this.initial;
    }
    public set Initial(initial: Initial) {
        if(!initial || !(initial instanceof Initial)) {
            throw new Error('Initial is not valid!');
        }
        this.initial = initial;
    }

    public get Sequence(): Sequence[] {
        return this.sequence;
    }
    public set Sequence(sequence: Sequence[]) {
        if(!sequence || !(sequence instanceof Array)) {
            throw new Error('Array<Sequence> is not valid!');
        }
        this.sequence = sequence;
    }
    
    public get Final(): Final {
        return this.final;
    }
    public set Final(final: Final) {
        if(!final || !(final instanceof Final)) {
            throw new Error('Final is not valid!');
        }
        this.final = final;
    }
}