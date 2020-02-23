import { Terminal } from 'xterm';
import * as pty from 'node-pty';
import * as os from 'os';
import { ITerminal } from 'node-pty/lib/interfaces';
import { loadTheme } from '../settings/handler';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { LigaturesAddon } from 'xterm-addon-ligatures';
import Settings, { ISettings, ITheme } from '../settings/Settings';

export default class SquidTerminal {

    private xterm: Terminal;
    private ptyProcess: ITerminal;
    private settings: Settings;
    private termId: number;
    private fitAddon: FitAddon;

    constructor(settings: Settings, termId: number) {

        this.settings = settings;
        this.termId = termId;

        this.xterm = this.buildTerminal();
        this.ptyProcess = this.buildPtyProcess();

        this.applyTheme();

        // Open the terminal
        this.xterm.open(document.getElementById(this.getPrefixTermId()));

        this.applyAddons();
        this.fit();

        this.xterm.onResize((data: {cols: number, rows: number}) => this.onResize(data));
        this.xterm.onData((data: string) => this.onData(data));
        this.ptyProcess.on('data', (data: string) => this.onPtyData(data));

        window.onresize = () => this.fit();
    }

    /**
     * Build the terminal object
     * @return The terminal
     */
    buildTerminal(): Terminal {

        return new Terminal({

            cursorBlink: this.settings.get('cursor').blink,
            cursorStyle: this.settings.get('cursor').style,
            //experimentalCharAtlas: settings.get('experimentalCharAtlas'),
            fontSize: this.settings.get('font').size,
            fontFamily: this.settings.get('font').family
        });
    }

    /**
     * Build the pty process thanks to node-pty
     * @return The pty process
     */
    buildPtyProcess(): ITerminal {

        return pty.spawn(os.platform() === 'win32' ? this.settings.get('bash') : process.env.SHELL || '/bin/bash', [], {

            name: 'xterm-256color',
            cols: this.xterm.cols,
            rows: this.xterm.rows,
        });
    }

    /**
     * Apply the theme
     */
    applyTheme() {

        const currentTheme = this.settings.get('currentTheme');
        let theme = this.settings.get('theme');

        if(currentTheme != theme.name)
            theme = loadTheme(currentTheme);

        this.xterm.setOption('theme', theme);
    }

    /**
     * Apply a new theme
     * @param theme
     */
    applyNewTheme(theme: ITheme) {

        this.xterm.setOption('theme', theme);
    }

    /**
     * Apply the addons needed
     */
    applyAddons() {

        this.xterm.loadAddon(this.fitAddon = new FitAddon());
        this.xterm.loadAddon(new WebLinksAddon());
        this.xterm.loadAddon(new LigaturesAddon());
    }

    /**
     * Apply the new settings
     * @param settings
     */
    applySettings(settings: ISettings) {

        this.applyNewTheme(loadTheme(settings.currentTheme));

        this.xterm.setOption('cursorBlink', settings.cursor.blink);
        this.xterm.setOption('cursorStyle', settings.cursor.style);
        this.xterm.setOption('fontSize', settings.font.size);
        this.xterm.setOption('fontFamily', settings.font.family);
    }

    /**
     * Fit the terminal
     */
    fit() {

        this.fitAddon.fit();
    }

    /**
     * Focus the terminal
     */
    focus() {

        this.xterm.focus();
    }

    /**
     * Called when we resize the terminal
     * @param data
     */
    onResize(data: {cols: number, rows: number}) {

        this.ptyProcess.resize(
            Math.max(data ? data.cols : this.xterm.cols, 1),
            Math.max(data ? data.rows : this.xterm.rows, 1));
    }

    /**
     * Called when data is received from the terminal
     * @param data
     */
    onData(data: string) {

        this.ptyProcess.write(data);
    }

    /**
     * Called when data is received from pty
     * @param data
     */
    onPtyData(data: string) {

        this.xterm.write(data);
    }

    /**
     * Return the terminal id
     * @return string
     */
    getTermId(): number {

        return this.termId;
    }

    /**
     * Return the terminal id with 'pane-'
     * @return string
     */
    getPrefixTermId(): string {

        return 'pane-' + this.getTermId();
    }
}
