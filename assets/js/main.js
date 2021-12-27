const quickChatForm = document.querySelector('#quickChatForm'),
    historyButton = document.querySelector('#historyButton'),
    startAChatButton = document.querySelector('#startAChat'),
    noHistoryPage = document.querySelector('#no-history'),
    historyPage = document.querySelector('#recent-chats'),
    fileImportButton = document.querySelector('#fileImport'),
    clearHistoryButton = document.querySelector('#clearHistory'),
    historyItemTemplate = document.querySelector('template'),
    appInfo = 'in.joydey.directChat.appData';
let publicApiUrl = "https://api.whatsapp.com/send?phone=91",
    chats = [];

window.addEventListener('DOMContentLoaded', function () {
    renderRecentChats();
})


const saveData = dataItem => {
    let savedData = localStorage.getItem(appInfo);
    if (savedData === null) {
        chats.push(dataItem);
        localStorage.setItem(appInfo, JSON.stringify(chats));
    } else {
        chats = JSON.parse(savedData);
        chats.push(dataItem);
        localStorage.setItem(appInfo, JSON.stringify(chats));
    }
}

const sendMessage = number => {
    location.href = publicApiUrl + number;
}

const importFile = target => {
    let file = target.files[0],
        reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        localStorage.setItem(appInfo, reader.result);
        renderRecentChats();
    }
    reader.onerror = function () {
        console.log(reader.error);
    }
}

const scrollTo = elem => {
    document.querySelector(elem).scrollIntoView(true);
}

const renderRecentChats = () => {
    let savedData = JSON.parse(localStorage.getItem(appInfo));
    if (savedData != null) {
        let chatGrid = historyPage.querySelector('.chat-grid');
        chatGrid.innerHTML = "";
        savedData.forEach(data => {
            let recentChatElement = document.importNode(historyItemTemplate.content, true),
                phoneNumber = recentChatElement.querySelector('strong'),
                date = recentChatElement.querySelector('#date'),
                time = recentChatElement.querySelector('#time');

            phoneNumber.innerText = `+91-${data.phoneNumber}`;
            date.innerText = data.date;
            time.innerText = data.time;
            chatGrid.appendChild(recentChatElement);
        })
        historyPage.style.display = 'grid';
    } else {
        noHistoryPage.style.display = 'grid';
    }

    if(savedData === null && historyPage.style.display === 'grid') {
        historyPage.style.display = 'none';
        noHistoryPage.style.display = 'grid';
    }
    if(savedData != null && noHistoryPage.style.display === 'grid') {
        noHistoryPage.style.display = 'none';
    }

}

quickChatForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const data = new FormData(this);
    data.append('date', new Date().toLocaleDateString('UTC', {day: "numeric", month: "long", year: "numeric"}));
    data.append('time', new Date().toLocaleTimeString('UTC', {hour: "numeric", minute: "numeric", hour12: true}));
    let dataObject = Object.fromEntries(data);
    saveData(dataObject);
    sendMessage(dataObject.phoneNumber);
})

const download = () => {
    let data = localStorage.getItem(appInfo);
    let dataUri = 'data:application/json;base64,';
    let link = document.createElement('a');
    link.setAttribute('href', `${dataUri}${btoa(data)}`);
    link.setAttribute('download', `${appInfo}_${new Date().getTime()}.dchat`);
    link.click();
};

historyButton.addEventListener('click', function () {
    scrollTo('#history');
})

startAChatButton.addEventListener('click', function () {
    scrollTo('#header-main');
})

fileImportButton.addEventListener('change', function () {
    importFile(this);
})

clearHistoryButton.addEventListener('click', function () {
    localStorage.removeItem(appInfo);
    renderRecentChats();
})
