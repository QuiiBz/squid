import { IShortcut, IShortcutActions } from '@common/shortcuts/shortcuts';
import { MenuItemConstructorOptions, remote } from 'electron';
import { IConfig } from 'common/config/Config';
import { defaultConfig } from '@common/config/defaultConfig';
import { isMac } from '@common/utils/utils';
import { installCLI, isCLIInstalled, shouldUpdateCLI, uninstallCLI } from '@src/cli/install';
const { Menu, app, shell } = remote;

/**
 * Build the app menu with the given shortcuts from the config.
 *
 * @param config - The config to use
 * @param executeShortcut - A callback called when a shortcut is executed
 * @returns The built menu
 */
// eslint-disable-next-line
export const buildMenu = (config: IConfig, executeShortcut: (shortcut: IShortcut) => void): any => {

    const cliInstalled = isCLIInstalled();
    const cliUpdate = shouldUpdateCLI(cliInstalled);

    const template: Array<MenuItemConstructorOptions> = [
        (isMac ? {
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        } : { }),
        {
            label: 'Terminal',
            submenu: [
                { label: 'New terminal', ...getShortcut(config, executeShortcut, 'terminal:create') },
                { label: 'Close terminal', ...getShortcut(config, executeShortcut, 'terminal:close') },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { label: 'Copy', accelerator: 'CmdOrCtrl+C', click: () => executeShortcut({ action:  'default:copy', keybinds: '' }) },
                { label: 'Paste', accelerator: 'CmdOrCtrl+V', click: () => executeShortcut({ action:  'default:paste', keybinds: '' }) },
                isMac ? { role: 'pasteAndMatchStyle' } : { },
                { role: 'selectAll' },
                isMac ? { role: 'pasteAndMatchStyle' } : { },
                { type: 'separator' },
                isMac ? {
                    label: 'Speech',
                    submenu: [
                        { role: 'startSpeaking' },
                        { role: 'stopSpeaking' }
                    ]
                } : { },
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { label: 'Zoom In', ...getShortcut(config, executeShortcut, 'terminal:zoomin') },
                { label: 'Zoom Out', ...getShortcut(config, executeShortcut, 'terminal:zoomout') },
                { type: 'separator' },
                { label: 'Focus left terminal', ...getShortcut(config, executeShortcut, 'terminal:left') },
                { label: 'Focus right terminal', ...getShortcut(config, executeShortcut, 'terminal:right') },
            ]
        },
        {
            label: 'CLI',
            submenu: [
                {
                    label: 'Install CLI',
                    enabled: !cliInstalled,
                    click: async() => await installCLI(true),
                },
                {
                    label: 'Uninstall CLI',
                    enabled: cliInstalled,
                    click: async() => await uninstallCLI(true),
                },
                { type: 'separator' },
                {
                    label: 'Update CLI',
                    enabled: cliUpdate,
                    click: async() => {

                        await uninstallCLI(true);
                        await installCLI(true);
                    },
                },
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                isMac ? { type: 'separator' } : { },
                isMac ? { role: 'front' } : { },
                isMac ? { type: 'separator' } : { },
                isMac ? { role: 'togglefullscreen' } : { },
            ]
        },
        {
            role: 'help',
            submenu: [
                // TODO change urls
                {
                    label: 'Website',
                    click: async() => await shell.openExternal('https://github.com/squidjs/terminal'),
                },
                {
                    label: 'Documentation',
                    click: async() => await shell.openExternal('https://github.com/squidjs/terminal'),
                },
                {
                    label: 'GitHub',
                    click: async() => await shell.openExternal('https://github.com/squidjs/terminal'),
                }
            ]
        }
    ];

    return Menu.buildFromTemplate(template);
}


/**
 * Get the shortcut properties for the given shortcut action.
 *
 * @param config - The config to use
 * @param executeShortcut - A callback called when a shortcut is executed
 * @param shortcutAction - The action of the shortcut to get
 * @returns An object containing the accelerator and the onClick callback
 */
const getShortcut = (config: IConfig, executeShortcut: (shortcut: IShortcut) => void, shortcutAction: IShortcutActions): { accelerator: string, click: () => void } => {

    let shortcut = config.shortcuts.find((current) => current.action === shortcutAction);

    if(!shortcut)
        // eslint-disable-next-line
        shortcut = defaultConfig.shortcuts.find((current) => current.action === shortcutAction) as IShortcut;

    // eslint-disable-next-line
    return { accelerator: shortcut.keybinds, click: () => executeShortcut(shortcut as IShortcut) };
}

