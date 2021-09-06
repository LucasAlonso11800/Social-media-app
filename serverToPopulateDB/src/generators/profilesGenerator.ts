import { Connection } from 'mysql2';
import faker from 'faker';
import insert from '../Helpers/Insert';

export default async function profilesGenerator(connection: Connection) {
    for (let i = 0; i < 100; i++) {
        const description = faker.company.catchPhrase();
        
        const profile = {
            user_id: i + 1,
            name: faker.name.firstName(),
            description: description.length > 140 ? description.substring(0, 140) : description
        };

        const query = `INSERT INTO profiles(
            profile_user_id, profile_profile_name, profile_profile_description
        ) VALUES (
            ${profile.user_id}, "${profile.name}", "${profile.description}"
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};