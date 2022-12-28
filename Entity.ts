import {Component} from "./Component";

export type IS_ROOT = "IS_ROOT";

export class Entity implements Component {
    private components: Component[] = [];

    constructor(private name, parent: Entity | IS_ROOT) {
        if (parent !== "IS_ROOT") {
            if (!parent) {
                throw new Error();
            }
            parent.addComponent(this);
        }
    }

    public createEntity(name): Entity {
        return new Entity(name, this);
    }

    public addComponent<T extends Component>(component: T): T {
        this.components.push(component);
        return component;
    }

    public removeAllComponents() {
        this.components.forEach((comp) => {
            this.removeComponent(comp);
        })
    }

    public removeComponent<T extends Component>(component: T): T {
        if ("destroy" in component) {
            (component as any).destroy();
        }
        this.components = this.components.filter((comp) => {
            return comp != component;
        });
        return component;
    }


    public addComponents(components: Component[]) {
        components.forEach(comp => {
            this.addComponent(comp);
        });
    }

    public getComponents(): Component[] {
        return this.components;
    }

    public getComponentByType(n: string): Component[] {
        let ret = [];
        this.components.forEach(comp => {
            if (comp.getType() === n) {
                ret.push(comp);
            }
        });
        return ret;
    }

    /**
     * Name only works on entity
     * @param n
     */
    public getEntityByNameStartsWith(n: string): Entity[] {
        let ret = [];
        this.components.forEach((comp: any) => {
            if (comp.getName && comp.getName().startsWith(n)) {
                ret.push(comp);
            }
        });
        return ret;
    }

    /**
     * Name only works on entity
     * @param n
     */
    public getFirstEntityByNameStartsWith(n: string): Entity {
        return this.getEntityByNameStartsWith(n)[0];
    }

    public getFirstComponentByType<T extends Component>(n: string): T {
        if (this.getComponentByType(n).length > 1) {
            throw new Error("multiple component detected please use getComponentByType")
        }
        return this.getComponentByType(n)[0] as T;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return Entity.name;
    }

    destroy(): void {
        this.removeAllComponents();
    }

}