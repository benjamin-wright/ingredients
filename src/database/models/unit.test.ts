import { test, describe, beforeEach, expect, vi } from 'vitest';
import { getUnits, getUnit, updateUnit, deleteUnit, getBaseUnit } from '@/database/models/unit';
import { MockDatabase } from '@/database/database-mock';

let mockDatabase: MockDatabase;

vi.mock('@/database/database', async () => {
    return {
        query: async (sql: string, bind?: any[], reader?: (row: any[]) => any) => {
            return mockDatabase.query(sql, bind, reader);
        }
    }
});

describe('getUnits', () => {
    test('should return the units', async () => {
        mockDatabase = new MockDatabase();
        const units = await getUnits();
        expect(units).toStrictEqual([
            { id: 1, name: 'grams', singular: 'g', plural: 'g', kind: 1, conversion: 1 },
            { id: 2, name: 'kilograms', singular: 'kg', plural: 'kg', kind: 1, conversion: 1000 },
            { id: 3, name: 'millilitres', singular: 'ml', plural: 'ml', kind: 2, conversion: 1 },
            { id: 4, name: 'litres', singular: 'l', plural: 'l', kind: 2, conversion: 1000 },
            { id: 5, name: 'count', singular: '', plural: '', kind: 3, conversion: 1 },
            { id: 6, name: 'cans', singular: ' can', plural: ' cans', kind: 3, conversion: 1 },
        ]);
    });
});

describe('getUnit', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should return the unit', async () => {
        const unit = await getUnit(1);
        expect(unit).toStrictEqual({ id: 1, name: 'grams', singular: 'g', plural: 'g', kind: 1, conversion: 1 });
    });

    test('should throw if not found', async () => {
        await expect(getUnit(100)).rejects.toThrow();
    });
});

describe('updateUnit', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should update the unit', async () => {
        await updateUnit(1, 'test', 't', 'ts', 1, 2);
        const unit = await getUnit(1);
        expect(unit).toStrictEqual({ id: 1, name: 'test', singular: 't', plural: 'ts', kind: 1, conversion: 2 });
    });

    test('should make no changes if not found', async () => {
        await updateUnit(100, 'test', 't', 't', 1, 1);
        const units = await getUnits();
        expect(units).toStrictEqual([
            { id: 1, name: 'grams', singular: 'g', plural: 'g', kind: 1, conversion: 1 },
            { id: 2, name: 'kilograms', singular: 'kg', plural: 'kg', kind: 1, conversion: 1000 },
            { id: 3, name: 'millilitres', singular: 'ml', plural: 'ml', kind: 2, conversion: 1 },
            { id: 4, name: 'litres', singular: 'l', plural: 'l', kind: 2, conversion: 1000 },
            { id: 5, name: 'count', singular: '', plural: '', kind: 3, conversion: 1 },
            { id: 6, name: 'cans', singular: ' can', plural: ' cans', kind: 3, conversion: 1 },
        ]);
    });
});

describe('deleteUnit', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should delete the unit', async () => {
        await deleteUnit(1);
        const units = await getUnits();
        expect(units).toStrictEqual([
            { id: 2, name: 'kilograms', singular: 'kg', plural: 'kg', kind: 1, conversion: 1000 },
            { id: 3, name: 'millilitres', singular: 'ml', plural: 'ml', kind: 2, conversion: 1 },
            { id: 4, name: 'litres', singular: 'l', plural: 'l', kind: 2, conversion: 1000 },
            { id: 5, name: 'count', singular: '', plural: '', kind: 3, conversion: 1 },
            { id: 6, name: 'cans', singular: ' can', plural: ' cans', kind: 3, conversion: 1 },
        ]);
    });

    test('should make no changes if not found', async () => {
        await deleteUnit(100);
        const units = await getUnits();
        expect(units).toStrictEqual([
            { id: 1, name: 'grams', singular: 'g', plural: 'g', kind: 1, conversion: 1 },
            { id: 2, name: 'kilograms', singular: 'kg', plural: 'kg', kind: 1, conversion: 1000 },
            { id: 3, name: 'millilitres', singular: 'ml', plural: 'ml', kind: 2, conversion: 1 },
            { id: 4, name: 'litres', singular: 'l', plural: 'l', kind: 2, conversion: 1000 },
            { id: 5, name: 'count', singular: '', plural: '', kind: 3, conversion: 1 },
            { id: 6, name: 'cans', singular: ' can', plural: ' cans', kind: 3, conversion: 1 },
        ]);
    });
});

describe('getBaseUnit', () => {
    beforeEach(async () => {
        mockDatabase = new MockDatabase();
    });

    test('should return the base unit for kind 1', async () => {
        const units = await getUnits();
        const unit = getBaseUnit(units, units[0]);
        expect(unit).toStrictEqual(units[0]);
    });

    test('should return the base unit for kind 1 with conversion', async () => {
        const units = await getUnits();
        const unit = getBaseUnit(units, units[1]);
        expect(unit).toStrictEqual(units[0]);
    });

    test('should return the base unit for kind 2', async () => {
        const units = await getUnits();
        const unit = getBaseUnit(units, units[2]);
        expect(unit).toStrictEqual(units[2]);
    });

    test('should return the base unit for kind 2 with conversion', async () => {
        const units = await getUnits();
        const unit = getBaseUnit(units, units[3]);
        expect(unit).toStrictEqual(units[2]);
    });

    test('should return the base unit for kind 3', async () => {
        const units = await getUnits();
        const unit = getBaseUnit(units, units[4]);
        expect(unit).toStrictEqual(units[4]);
    });

    test('should not convert for kind 3', async () => {
        const units = await getUnits();
        const unit = getBaseUnit(units, units[5]);
        expect(unit).toStrictEqual(units[5]);
    });
});