(() => {
    const socket = io("wss://casino-ai.botzone.com.br", { transports: ["websocket"] });
    // const socket = io("ws://144.91.69.149:4888", { transports: ["websocket"] });

    const geracaoContainer = document.getElementById("geracao");
    const stepContainer = document.getElementById("step");
    const rouletteHistoryContainer = document.getElementById("roulette-history");
    const usersContainer = document.getElementById("users-container");
    const bestIaBTN = document.getElementById("bestBtn");
    const endOfGenContainer = document.getElementById("endOfGenContainer");

    function formatPrice(value) {
        return new Intl
            .NumberFormat('pt-br', { style: 'currency', currency: 'BRL', })
            .format(value)
    }

    socket.on('initialConfig', async (data) => {
        geracaoContainer.innerText = data.info.generation
        stepContainer.innerText = data.info.step
        bestIaBTN.href = `#${data.info.bestUser}`


        let html = '';

        data.users.forEach((user) => {
            html += `
            <div class="col-lg-4">
                <div class="card mb-3" style="max-width: 540px;" data-id="${user._id}" id="${user._id}">
                    <div class="row g-0">
                        <div class="col-md-4" style="margin: 5px;">
                            <img src="${user.avatar}" class="img-fluid rounded-start" alt="Avtar de ${user.name}">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h5 class="card-title">${user.name}</h5>
                                <p class="card-text">
                                    Saldo: <span class="current_cash">${formatPrice(user.balance)}</span> <br />
                                    Score: ${user.score}
                                    ${user.history.length > 0 ? `<br /> Lucro gerado: ${formatPrice(user.history.reduce((a, b) => a + b) - (user.history.length * 300))}` : ''}
                                    ${user.history.length > 0 ? `<br /> Gerado à ${user.history.length} gerações (Geração ${data.info.generation - user.history.length})` : '<br />Criado nesta geração'}
                                    ${user.trophies ? `<br /> Troféus: ${user.trophies}` : ''}
                                </p>
                                <div class="col-auto">
                                    <label class="visually-hidden" for="autoSizingInputGroup">Username</label>
                                    <div class="input-group">
                                    <div class="input-group-text">🎰</div>
                                    <input type="text" class="form-control bet_user " placeholder="Aposta" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        usersContainer.innerHTML = html;
    });

    socket.on('reload', async (data) => {
        window.location.reload();
    });

    socket.on('sortedNewNumber', async (data) => {
        let count = 1;
        let html = "";
        data.history.forEach(number => {

            if (count == 6) {
                html += "</tr>"
                count = 1;
            }

            if (count == 1) {
                html += "<tr>"
            }

            html += `<td class="text-center" style="width: 25px; height: 25px;">${number}</td>`

            count++;
        });

        rouletteHistoryContainer.innerHTML = html;
    });

    socket.on('refreshBalance', async (data) => {
        const user = document.querySelector(`[data-id="${data.userId}"]`);
        if (user) {
            user.querySelector('.current_cash').innerText = formatPrice(data.balance);
        }
    });

    socket.on('finishGen', async (data) => {
        let html = '';
        data.usersGen.forEach(user => {
            html += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.score}</td>
                    <td>${formatPrice(user.balance - 300)}</td>
                <tr>
            `;
        })

        endOfGenContainer.innerHTML = html;
        new bootstrap.Modal('#endGenModal').show()
    });

    socket.on('refreshInfo', async (data) => {
        geracaoContainer.innerText = data.info.generation
        stepContainer.innerText = data.info.step
        bestIaBTN.href = `#${data.info.bestUser}`
    });

    socket.on('newUsers', async (data) => {
        let html = '';
        data.users.forEach((user) => {
            html += `
            <div class="col-lg-4">
                <div class="card mb-3" style="max-width: 540px;" data-id="${user._id}" id="${user._id}">
                    <div class="row g-0">
                        <div class="col-md-4" style="margin: 5px;">
                            <img src="${user.avatar}" class="img-fluid rounded-start" alt="Avtar de ${user.name}">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h5 class="card-title">${user.name}</h5>
                                <p class="card-text">
                                    Saldo: <span class="current_cash">${formatPrice(user.balance)}</span> <br />
                                    Score: ${user.score}
                                    ${user.history.length > 0 ? `<br /> Lucro gerado: ${formatPrice(user.history.reduce((a, b) => a + b) - (user.history.length * 300))}` : ''}
                                    ${user.history.length > 0 ? `<br /> Gerado à ${user.history.length} gerações` : '<br />Criado nesta geração'}
                                    ${user.trophies ? `<br /> Troféus: ${user.trophies}` : ''}
                                </p>
                                <div class="col-auto">
                                    <label class="visually-hidden" for="autoSizingInputGroup">Username</label>
                                    <div class="input-group">
                                    <div class="input-group-text">🎰</div>
                                    <input type="text" class="form-control bet_user " placeholder="Aposta" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        usersContainer.innerHTML = html;
    });

    socket.on('newBet', async (data) => {
        const user = document.querySelector(`[data-id="${data.userId}"]`);
        if (user) {
            user.querySelector('.current_cash').innerText = formatPrice(data.balance);
            user.querySelector('.bet_user').value = data.bet.join(', ');
        }
    });

})()
