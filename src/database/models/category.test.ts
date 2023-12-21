import { test, describe, beforeEach, expect, vi } from 'vitest';
import { getCategories, addCategory, getCategory, deleteCategory, updateCategory, swapCategories } from './category';
import { MockDatabase } from '@/database/database-mock';

let mockDatabase: MockDatabase;

vi.mock('@/database/database', async () => {
    return {
        query: async (sql: string, bind?: any[], reader?: (row: any[]) => any) => {
            return mockDatabase.query(sql, bind, reader);
        }
    }
});

describe('addCategory', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });
    
    test('should auto-increment', async () => {
        expect([
            await addCategory('Test 1'),
            await addCategory('Test 2'),
            await addCategory('Test 3'),
        ]).toEqual([1, 2, 3]);
    });

    test('should throw if duplicate name', async () => {
        await addCategory('Test');
        await expect(addCategory('Test')).rejects.toThrow();
    });
    
    test('should throw if duplicate name without casing', async () => {
        await addCategory('Test');
        await expect(addCategory('teST')).rejects.toThrow();
    });
});

describe('getCategories', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should auto-number appropriately', async () => {
        await addCategory('Test 1');
        await addCategory('Test 2');

        const categories = await getCategories();
        expect(categories).toStrictEqual([
            { id: 1, position: 1, name: 'test 1'},
            { id: 2, position: 2, name: 'test 2'},
        ]);
    });
});

describe('getCategory', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should return the category', async () => {
        await addCategory('Test');

        const category = await getCategory(1);
        expect(category).toStrictEqual({ id: 1, position: 1, name: 'test'});
    });

    test('should return the first category', async () => {
        await addCategory('Test 1');
        await addCategory('Test 2');

        const category = await getCategory(1);
        expect(category).toStrictEqual({ id: 1, position: 1, name: 'test 1'});
    });

    test('should return the last category', async () => {
        await addCategory('Test 1');
        await addCategory('Test 2');

        const category = await getCategory(2);
        expect(category).toStrictEqual({ id: 2, position: 2, name: 'test 2'});
    });

    test('should throw if no category', async () => {
        await expect(getCategory(1)).rejects.toThrow();
    });

    test('should throw if no category with id', async () => {
        await addCategory('Test');
        await expect(getCategory(2)).rejects.toThrow();
    });
});

describe('deleteCategory', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should delete the category', async () => {
        await addCategory('Test');
        await addCategory('Test 2');

        await deleteCategory(1);

        expect(await getCategories()).toStrictEqual([
            { id: 2, position: 2, name: 'test 2'},
        ]);
    });

    test('should fail silently if no category', async () => {
        await deleteCategory(1);
    });

    test('should not delete anything if no category with id', async () => {
        await addCategory('Test');
        await addCategory('Test 2');

        await deleteCategory(3);

        expect(await getCategories()).toStrictEqual([
            { id: 1, position: 1, name: 'test'},
            { id: 2, position: 2, name: 'test 2'},
        ]);
    });
});

describe('updateCategory', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should update the category', async () => {
        await addCategory('Test');
        await addCategory('Test 2');

        await updateCategory(1, 'Test 3');

        expect(await getCategories()).toStrictEqual([
            { id: 1, position: 1, name: 'test 3'},
            { id: 2, position: 2, name: 'test 2'},
        ]);
    });

    test('should not throw if no category', async () => {
        await updateCategory(1, 'Test');
    });

    test('should not make changes if no category with id', async () => {
        await addCategory('Test');
        await addCategory('Test 2');

        await updateCategory(3, 'Test 3');

        expect(await getCategories()).toStrictEqual([
            { id: 1, position: 1, name: 'test'},
            { id: 2, position: 2, name: 'test 2'},
        ]);
    });

    test('should throw if duplicate name', async () => {
        await addCategory('Test');
        await addCategory('Test 2');

        await expect(updateCategory(2, 'Test')).rejects.toThrow();
    });

    test('should throw if duplicate name without casing', async () => {
        await addCategory('Test');
        await addCategory('Test 2');

        await expect(updateCategory(2, 'teST')).rejects.toThrow();
    });
});

describe('swapCategories', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should swap categories', async () => {
        await addCategory('Test');
        await addCategory('Test 2');

        await swapCategories(
            { id: 1, position: 1},
            { id: 2, position: 2}
        );

        expect(await getCategories()).toStrictEqual([
            { id: 2, position: 1, name: 'test 2'},
            { id: 1, position: 2, name: 'test'},
        ]);
    });

    test('should not throw if no category', async () => {
        await swapCategories(1, 2);
    });

    test('should not make changes if no category with id', async () => {
        await addCategory('Test');
        await addCategory('Test 2');

        await swapCategories(1, 3);

        expect(await getCategories()).toStrictEqual([
            { id: 1, position: 1, name: 'test'},
            { id: 2, position: 2, name: 'test 2'},
        ]);
    });
});