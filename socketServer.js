//здесь наодится основная логика работы сокет сервера, обработчики событий, соединение и т д
const authSocket = require('./middleware/authSocket')
const newConnectionHandler = require('./socketHandlers/newConnectionHandler')
const disconnectHandler = require('./socketHandlers/disconnectHandler')
const directMessageHandler = require("./socketHandlers/directMessageHandler")
const directChatHistoryHandler = require('./socketHandlers/directChatHistoryHandler')

const serverStore = require('./serverStore')


const registerSocketServer = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            method: ['GET', 'POST']
        }
    })

    //здесь очень интересно, так как эта функция сетит наш io инстанс для дальнейшего переипользования в разных частях приложения
    //то есть мы можем писать io хендлеры не только в этом файле
    serverStore.setSocketServerInstance(io);

    io.use((socket, next) => {
        authSocket(socket, next);
    })

    const emitOnlineUsers = () => {
        const onlineUsers = serverStore.getOnlineUsers()
        io.emit('online-users', {onlineUsers})
    }

    io.on('connection', (socket) => {
        newConnectionHandler(socket, io);
        emitOnlineUsers()

        socket.on('direct-message', (data) => {
            directMessageHandler(socket, data)
        })

        socket.on('direct-chat-history', (data) => {
            directChatHistoryHandler(socket, data)
        })

        socket.on('disconnect', () => {
            disconnectHandler(socket)
        })
    })

    setInterval(() => {
        emitOnlineUsers()
    }, [1000 * 8])
}

module.exports = {
    registerSocketServer,
}