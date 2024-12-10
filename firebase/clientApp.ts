import { ClientData } from "@/types"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, update, child, get, remove } from "firebase/database"

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "plastilin-b7867.firebaseapp.com",
    databaseURL: "https://plastilin-b7867-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "plastilin-b7867",
    storageBucket: "plastilin-b7867.appspot.com",
    messagingSenderId: "26760354406",
    appId: "1:26760354406:web:9f918f9d19950e7c222ba7",
    measurementId: "G-CHVJX8GMWS"
}

initializeApp(firebaseConfig)

const db = getDatabase()
const dbRef = ref(db);

export async function getClients() {
    const snapshot = await get(child(dbRef, `clients`));

    if (snapshot.exists()) {
        return snapshot.val(); // This will return the actual data
    } else {
        return [];
    }
}

export async function addClient(childName: string, email: string) {
    const clients = await getClients()
    let id = clients ? clients[clients.length - 1].id + 1 : 0
    await set(child(dbRef, `clients/${id}`), {
        id,
        childName,
        email,
        hasCome: false,
    })

    return id
}

export async function removeClient(clientId: number) {
    await remove(child(dbRef, `clients/${clientId}`))
    return true
}

export async function changeClientsStatus(newHasComeClients: ClientData[], newOutClients: ClientData[]) {
    newHasComeClients.forEach(client => {
        update(child(dbRef, `clients/${client.id}`), {
            hasCome: true
        })
    })

    newOutClients.forEach(client => {
        update(child(dbRef, `clients/${client.id}`), {
            hasCome: false
        })
    })

    return true
}

export const denyAll = () => {
    const usersRef = ref(db, 'clients'); // Ссылка на коллекцию пользователей
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val();
            Object.keys(users).forEach((userId) => {
                if (users[userId].email !== 'botneva02@gmail.com') { // Проверяем, что пользователь не админ
                    update(child(usersRef, userId), {
                        hasCome: false // Устанавливаем доступ в false
                    });
                }
            });
        }
    }).catch((error) => {
        console.error('Ошибка при обновлении прав:', error);
    });
};