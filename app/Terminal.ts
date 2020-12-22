import XTerminalFactory from './factories/XTerminalFactory';
import PtyFactory from './factories/PtyFactory';
import { IConfig } from './config/Config';

export default class Terminal {

	private config: IConfig;

	private xTerminal: XTerminalFactory;
	private pty: PtyFactory;

	constructor(config: IConfig, id: number) {

		this.config = config;

		this.xTerminal = new XTerminalFactory();
		this.pty = new PtyFactory();

		const terminal = this.xTerminal.build({

			config: this.config,
		});

		const pty = this.pty.build({

			terminal: terminal,
			cwd: require('os').homedir(),
		});

		this.xTerminal.spawn(id, pty);
		this.pty.listen(terminal);
	}

	/**
	 * Focus the xterm instance.
	 */
	public focus() {

		this.xTerminal.getFactoryObject().focus();
	}

	/**
	 * Update the config for this terminal.
	 *
	 * @param config - The new config to use
	 */
	public updateConfig(config: IConfig) {

		this.config = config;

		this.xTerminal.loadConfig(config);
	}
}

export interface ITerminal {

	id: number;
	name: string;
}
