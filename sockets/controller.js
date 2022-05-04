const TicketControl = require("../models/ticket-control");


const ticketControl = new TicketControl();


const socketController = (socket) => {
    
    socket.emit('ultimo-ticket', {ultimo: ticketControl.ultimo, cola: ticketControl.tickets.length});
    socket.emit('estado-actual', ticketControl.ultimos4);

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });

    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketControl.siguiente();
        callback(siguiente);

        socket.broadcast.emit('ultimo-ticket', {ultimo: ticketControl.ultimo, cola: ticketControl.tickets.length});
    });

    socket.on('atender-ticket', ({escritorio}, callback) => {
        if(!escritorio) {
            return callback({
                og: false,
                msg: 'El escritorio es obligatrio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        if(!ticket) {
            return callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        }else {
            socket.broadcast.emit('ultimo-ticket', {ultimo: ticketControl.ultimo, cola: ticketControl.tickets.length});
            socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
            return callback({
                ok: true,
                ticket,
                cola: ticketControl.tickets.length
            });
        }

    });

}



module.exports = {
    socketController
}

