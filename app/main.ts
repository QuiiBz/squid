import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import Settings from './settings/Settings';

let mainWindow: BrowserWindow;
let settings: Settings;

function createWindow() {

    settings = new Settings();

    mainWindow = new BrowserWindow({

        width: 1200,
        height: 800,
        minWidth: 600,
        minHeight: 500,
        frame: false,
        title: 'Squid',
        icon: __dirname + '/assets/icons/png/icon.png',
        show: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });

    mainWindow.webContents.openDevTools({
        mode: 'detach'
    });

    mainWindow.loadURL(url.format({
        pathname: path.resolve('app/views/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => mainWindow = null);
}

app.disableHardwareAcceleration();

app.on('ready', () => createWindow());

app.on('window-all-closed', () => {

    settings.save();

    if(process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {

    if(mainWindow === null)
        createWindow();
});