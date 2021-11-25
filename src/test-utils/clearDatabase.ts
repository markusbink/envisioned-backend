import { Connection } from 'typeorm';

/**
 * Clears the database of all entries
 * @param connection Connection to the database
 */
export const clearDatabase = async (connection: Connection): Promise<void> => {
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
        await connection
            .createQueryBuilder()
            .delete()
            .from(entity.name)
            .execute();
    }
};
