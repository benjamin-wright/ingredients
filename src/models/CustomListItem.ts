import type Category from "./Category";

export default class CustomListItem {
    public id: number;
    public name: string;
    public category: Category;
    public need: boolean;

    constructor(id: number, name: string, category: Category, need: boolean = true) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.need = need;
    }
}