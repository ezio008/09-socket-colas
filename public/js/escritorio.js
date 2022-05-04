// Referencias
const lblPendientes = document.querySelector('#lblPendientes');
const btnSiguienteTicket = document.querySelector('button');
const lblEscritorio = document.querySelector('h1');
const lblAtendiendo = document.querySelector('small');
const divAlert = document.querySelector('#infoAlert');
console.log(divAlert);
const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

const socket = io();

socket.on('connect', () => {
    btnSiguienteTicket.disabled = false;

});

socket.on('disconnect', () => {
    btnSiguienteTicket.disabled = true;
});

socket.on('ultimo-ticket', ({ cola }) => {
    lblPendientes.innerText = cola;
    lblPendientes.style.display = cola === 0 ? 'none' : 'block';
    divAlert.style.display = cola === 0 ? 'block' : 'none';
    btnSiguienteTicket.disabled = cola === 0;
});

btnSiguienteTicket.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, ({ ticket, msg, cola }) => {
        if (!ticket) {
            console.log(msg);
            return;
        }
        lblAtendiendo.innerText = ticket.numero;
        lblPendientes.innerText = cola;
        lblPendientes.style.display = cola === 0 ? 'none' : 'block';
        divAlert.style.display = cola === 0 ? 'block' : 'none';
        btnSiguienteTicket.disabled = cola === 0;
    });
});