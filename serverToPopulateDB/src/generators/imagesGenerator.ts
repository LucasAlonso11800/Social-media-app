import { Connection } from 'mysql2';
import faker from 'faker';
import insert from '../Helpers/Insert';
import fs from 'fs';
import request from 'request';

export default async function imagesGenerator(connection: Connection) {
    for (let i = 0; i < 20; i++) {
        try {
            const imageURL = faker.image.imageUrl(200, 200);

            const base64 = await generateBase64Image(imageURL);

            const image = {
                type: "U",
                user_id: (i * 10) + 5,
                profile_id: null,
                image: base64
            };

            const query = `INSERT INTO images(
                image_type, image_user_id, image_profile_id, image_image
            ) VALUES (
                "${image.type}", ${image.user_id}, ${image.profile_id}, "${image.image}"
            )`;

            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
    for (let i = 0; i < 20; i++) {
        try {
            const imageURL = faker.image.imageUrl(800, 600);

            const base64 = await generateBase64Image(imageURL);

            const image = {
                type: "P",
                user_id: null,
                profile_id: (i * 10) + 5,
                image: base64
            };

            const query = `INSERT INTO images(
                image_type, image_user_id, image_profile_id, image_image
            ) VALUES (
                "${image.type}", ${image.user_id}, ${image.profile_id}, "${image.image}"
            )`;

            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

async function generateBase64Image(imageURL: string) {
    try {
        const buffer = await getImage(imageURL) as Buffer;
        await saveImage(buffer);
        const base64 = await readImage('temp.png');
        await deleteImage('temp.png');
        return base64;
    }
    catch (err: any) {
        throw new Error(err)
    }
};

function getImage(url: string) {
    return new Promise((resolve, reject) => {
        request({ url, encoding: null }, (err, res, body) => {
            if (err) reject(err)
            resolve(body)
        })
    })
};

function saveImage(buffer: Buffer) {
    return new Promise((resolve, reject) => {
        fs.writeFile('temp.png', buffer, { encoding: null }, (err) => {
            if (err) reject(err);
            resolve('')
        })
    })
};

function readImage(imagePath: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) reject(err);
            const base64 = Buffer.from(data).toString('base64');
            resolve(base64);
        })
    })
};

function deleteImage(imagePath: string) {
    return new Promise((resolve, reject) => {
        fs.unlink(imagePath, (err) => {
            if (err) reject(err);
            resolve('')
        })
    })
};