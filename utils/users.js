const users = []

export function userJoin(id, username, room){
    const user = { id, username, room }

    users.push(user)
    return user
}

export function currentUser (id){
    return users.find(user => user.id === id)
}

export function userLeft(id){
    const index = users.findIndex(user => user.id === id)

    if (index != -1){
        return users.splice(index, 1)[0]
    }
}

export function roomUsers(room) {
    return users.filter(user => user.room === room)
}