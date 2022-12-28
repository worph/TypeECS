export interface Component {
    getType(): string;

    destroy?(): void;
}