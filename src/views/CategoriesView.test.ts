import { vi, describe, test, beforeEach, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CategoriesView from './CategoriesView.vue';

import { MockDatabase } from '@/database/database-mock';
import { addCategory } from '@/database/models/category';
let mockDatabase: MockDatabase;

vi.mock('@/database/database', async () => {
    return {
        query: async (sql: string, bind?: any[], reader?: (row: any[]) => any) => {
            return mockDatabase.query(sql, bind, reader);
        }
    }
});

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: async () => {},
    }),
}));

describe('CategoriesView', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should render', async () => {
        await addCategory('Test');

        const wrapper = mount(CategoriesView, {
            global: {
                stubs: ['FontAwesomeIcon'],
            },
        });

        expect(wrapper.html()).toMatchSnapshot();
    });
});