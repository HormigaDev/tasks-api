import { SearchOperators } from '../enums/SearchOperators.enum';

export interface PropertySearch {
    key: string;
    operator: SearchOperators;
    value: any;
    valueEnd?: any;
}
