import { Phase } from "./phase";

export class Final extends Phase {
    private disabled!: boolean;

    public get Disabled(): boolean {
        return this.disabled;
    }
    public set Disabled(disabled: boolean) {
        this.disabled = disabled;
    }
}