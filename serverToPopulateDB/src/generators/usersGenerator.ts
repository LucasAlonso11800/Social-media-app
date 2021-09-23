import { Connection } from 'mysql2';
import bcrypt from 'bcryptjs';
import faker from 'faker';
import insert from '../Helpers/Insert';

export default async function usersGenerator(connection: Connection) {
    for (let i = 0; i < 20; i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const password = await bcrypt.hash(faker.lorem.word(), 10);

        const user = {
            username: `${firstName} ${lastName}`,
            email: faker.internet.email(firstName, lastName),
            password,
            city: faker.address.city(),
            country: faker.address.country(),
            birthDate: faker.date.past(Math.floor(Math.random() * 40), '2006-12-12').toISOString().substring(0, 10)
        };

        const query = `INSERT INTO users(
            user_username, user_email, user_password, user_city, user_country, user_birth_date
        ) VALUES (
            "${user.username}", "${user.email}", "${user.password}", "${user.city}", "${user.country}", "${user.birthDate}"
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};