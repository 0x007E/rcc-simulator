export class Workflow {
    private blocked: boolean = false;
    private finished: boolean = false;
    private released: boolean = false;
    private delay: number = 100;
    private interval!: number;

    public get Blocked(): boolean {
        return this.blocked;
    }
    public set Blocked(blocked: boolean) {
        this.blocked = blocked;
    }

    public get Released(): boolean {
        return this.released;
    }
    public set Released(released: boolean) {
        this.released = released;
    }

    public get Finished(): boolean {
        return this.finished;
    }

    public set Finished(finished: boolean) {
        this.finished = finished;
    }

    public get Delay(): number {
        return this.delay;
    }
    public set Delay(delay: number) {
        if(delay < 1) {
        throw new Error('Delay is not valid!');
        }
        this.delay = delay;
    }
    
    public get Interval(): number {
        return this.interval;
    }
    public set Interval(interval: number) {
        if(interval < 1) {
        throw new Error('Delay is not valid!');
        }
        this.interval = interval;
    }

    public reset() {
        this.Blocked = false;
        this.Finished = false;
    }
}