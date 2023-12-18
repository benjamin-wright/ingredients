import { query } from '../database';

export type ListItem = {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unitSingular: string;
    unitPlural: string;
};