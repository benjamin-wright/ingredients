export async function clearAll() {
    const dbs = await window.indexedDB.databases();

    for (const db of dbs) {
        try {
            await new Promise<void>((resolve, reject) => {
                if (db.name) {
                    const req = window.indexedDB.deleteDatabase(db.name);
                    req.onsuccess = () => resolve();
                    req.onerror = () => reject(new Error('Error deleting database'));
                    req.onblocked = () => reject(new Error('Blocked deleting database'));
                }
            });
        } catch (err: any) {
            console.warn(`Error deleting database ${db.name}: ${err.message}`);
        }
    }
}