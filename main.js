const electron = require ('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow; 
let profileWindow

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        width:1100,
        height:600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed',function(){
        app.quit();
    })

    const maniMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(maniMenu);
});

function createSetProfileWindow(){
    setProfileWindow = new BrowserWindow({
        width:500,
        height:600,
        title:'Set Payment Profile'
    });
    setProfileWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'setProfileWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    setProfileWindow.on('closed', function(){
        setProfileWindow = null;
    });
}

const mainMenuTemplate = [
    {
        label:'Settings',
        submenu:[
            {
                label: 'Payment Profile',
                click(){
                    createSetProfileWindow();
                }
            },
            {
                label: 'Clock'
            },
            {
                label: 'Proxy'
            },
            {
                label: 'Exit',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Dev tools',
        submenu:[
            {
                label:'Toggle Dev Tools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}

