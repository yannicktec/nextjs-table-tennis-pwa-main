import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "@/db/schema"

const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
});


console.log(`DB Connection: ${process.env.DATABASE_HOST}, ${process.env.DATABASE_USERNAME}, ${process.env.DATABASE_PASSWORD}`)

const db = drizzle(connection, { schema });

const users = [
    {
        "id": 16,
        "created_at": "2023-01-16 10:16:09.625229+00",
        "wins": 16,
        "name": "Michi",
        "emoji": "♿︎",
        "priority": 13
    },
    {
        "id": 112,
        "created_at": "2024-02-07 11:26:02.659674+00",
        "wins": 1,
        "name": "Bastian",
        "emoji": "🥵",
        "priority": 1000
    },
    {
        "id": 61,
        "created_at": "2023-08-03 10:42:14.545088+00",
        "wins": 1,
        "name": "Joel",
        "emoji": "💾",
        "priority": 24
    },
    {
        "id": 114,
        "created_at": "2024-02-07 11:38:17.865282+00",
        "wins": 1,
        "name": "Flo",
        "emoji": "⛷️",
        "priority": 1000
    },
    {
        "id": 49,
        "created_at": "2023-04-24 10:34:50.82933+00",
        "wins": 6,
        "name": "Ansgar",
        "emoji": "🚌",
        "priority": 5
    },
    {
        "id": 59,
        "created_at": "2023-08-01 10:44:18.771621+00",
        "wins": 0,
        "name": "Kian",
        "emoji": "☕️",
        "priority": 26
    },
    {
        "id": 31,
        "created_at": "2023-01-26 12:07:13.555452+00",
        "wins": 35,
        "name": "Marco",
        "emoji": "😴",
        "priority": 14
    },
    {
        "id": 45,
        "created_at": "2023-03-03 11:38:17.257069+00",
        "wins": 3,
        "name": "Alexandro",
        "emoji": "🤌",
        "priority": 17
    },
    {
        "id": 18,
        "created_at": "2023-01-16 19:29:06.775925+00",
        "wins": 17,
        "name": "Zernickel",
        "emoji": "🇰🇿",
        "priority": 15
    },
    {
        "id": 63,
        "created_at": "2023-08-31 10:55:02.920998+00",
        "wins": 9,
        "name": "Leo",
        "emoji": "🎣",
        "priority": 19
    },
    {
        "id": 50,
        "created_at": "2023-04-24 10:44:29.660648+00",
        "wins": 7,
        "name": "Gimbledore",
        "emoji": "🧙🏻‍♂️",
        "priority": 4
    },
    {
        "id": 44,
        "created_at": "2023-02-16 11:36:59.25024+00",
        "wins": 12,
        "name": "Nico",
        "emoji": "🇹🇭",
        "priority": 16
    },
    {
        "id": 65,
        "created_at": "2023-09-06 14:50:53.959779+00",
        "wins": 1,
        "name": "Anna",
        "emoji": "🏎️",
        "priority": 21
    },
    {
        "id": 113,
        "created_at": "2024-02-07 11:29:44.909475+00",
        "wins": 2,
        "name": "Maddin",
        "emoji": "🐘",
        "priority": 1000
    },
    {
        "id": 53,
        "created_at": "2023-05-16 10:41:06.351145+00",
        "wins": 0,
        "name": "Miro",
        "emoji": "🚜",
        "priority": 20
    },
    {
        "id": 52,
        "created_at": "2023-05-09 14:57:31.239297+00",
        "wins": 0,
        "name": "Patzner",
        "emoji": "🛫",
        "priority": 23
    },
    {
        "id": 23,
        "created_at": "2023-01-17 23:02:07.15582+00",
        "wins": -7,
        "name": "Marvin",
        "emoji": "🦖",
        "priority": 8
    },
    {
        "id": 43,
        "created_at": "2023-02-14 15:10:48.164154+00",
        "wins": 38,
        "name": "Basti",
        "emoji": "🏇🏻",
        "priority": 11
    },
    {
        "id": 69,
        "created_at": "2023-10-02 14:03:28.704416+00",
        "wins": -34,
        "name": "Tomothy",
        "emoji": "🎹",
        "priority": 6
    },
    {
        "id": 62,
        "created_at": "2023-08-07 10:43:18.244783+00",
        "wins": 0,
        "name": "Christoph",
        "emoji": "👨‍🍳",
        "priority": 25
    },
    {
        "id": 14,
        "created_at": "2023-01-16 10:15:24.466576+00",
        "wins": 11,
        "name": "Aaron",
        "emoji": "🧑🏻‍🦲",
        "priority": 1
    },
    {
        "id": 60,
        "created_at": "2023-08-02 17:57:02.361896+00",
        "wins": 6,
        "name": "Master of Balls",
        "emoji": "🍷",
        "priority": 9
    },
    {
        "id": 74,
        "created_at": "2023-11-21 11:34:33.604546+00",
        "wins": 0,
        "name": "Shao",
        "emoji": "🎥",
        "priority": 28
    },
    {
        "id": 64,
        "created_at": "2023-09-04 14:44:53.292626+00",
        "wins": 0,
        "name": "Nebojsa",
        "emoji": "🐻",
        "priority": 27
    },
    {
        "id": 37,
        "created_at": "2023-02-03 11:40:37.971157+00",
        "wins": 0,
        "name": "Jakob",
        "emoji": "🥸",
        "priority": 12
    },
    {
        "id": 38,
        "created_at": "2023-02-03 13:43:42.162236+00",
        "wins": 0,
        "name": "Lohrey",
        "emoji": "🏸",
        "priority": 22
    },
    {
        "id": 75,
        "created_at": "2023-11-29 11:42:04.493584+00",
        "wins": 0,
        "name": "Moritz",
        "emoji": "🪰",
        "priority": 29
    },
    {
        "id": 13,
        "created_at": "2023-01-16 10:14:54.897315+00",
        "wins": 0,
        "name": "Neef",
        "emoji": "🏓",
        "priority": 18
    },
    {
        "id": 19,
        "created_at": "2023-01-16 19:29:17.655854+00",
        "wins": -38,
        "name": "Sören",
        "emoji": "🧢",
        "priority": 3
    },
    {
        "id": 55,
        "created_at": "2023-06-21 14:14:15.826055+00",
        "wins": 42,
        "name": "Felix",
        "emoji": "😤",
        "priority": 10
    },
    {
        "id": 15,
        "created_at": "2023-01-16 10:15:47.730088+00",
        "wins": -8,
        "name": "Paul",
        "emoji": "🐼",
        "priority": 7
    },
    {
        "id": 17,
        "created_at": "2023-01-16 10:16:44.892242+00",
        "wins": -159,
        "name": "Yannick",
        "emoji": "🤤",
        "priority": 2
    }
]


const insertAllUsers = async () => {
    console.log("Inserting users")
    await db.transaction(async (tx) => {
        for (const user of users) {
            console.log("Inserting user", user.name)
            await tx.insert(schema.players).values({
                name: user.name,
                emoji: user.emoji,
                createdAt: new Date(user.created_at),
                createdBy: 1,
                rating: 25,
                priority: user.priority
            }).execute();
        }
    })
    console.log("Inserted all users")
}

insertAllUsers()