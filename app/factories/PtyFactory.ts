import { Factory } from '../../common/factories/Factory';
import { UndefinedObject } from '../../common/types/types';
import { IPty } from 'node-pty';
import * as pty from 'node-pty';
import { Terminal as XTerminal } from 'xterm';

export default class PtyFactory implements Factory<IPty> {

	public factoryObject: UndefinedObject<IPty>;

	/**
	 * Build a IPty object with params.
	 *
	 * @see PtyFactoryParams
	 *
	 * @param params - PtyFactoryParams
	 * @returns The IPty instance
	 */
	public build({ shell, terminal, cwd }: PtyFactoryParams): IPty {

		this.factoryObject = pty.spawn(shell, [], {

			name: 'xterm-256color',
			cols: terminal.cols,
			rows: terminal.rows,
			cwd,
		});

		return this.factoryObject;
	}

	/**
	 * Listen for events on the pty instance.
	 *
	 * @param terminal - The terminal to write on
	 * @param onClose - Called when the pty process is closed
	 */
	public listen(terminal: XTerminal, onClose: () => void) {

		this.getFactoryObject().onData((data: string) => {

			terminal.write(data);
		});

		this.getFactoryObject().onExit(onClose);
	}

	/**
	 * Get the instance of the built object.
	 *
	 * @returns The IPty instance
	 */
	public getFactoryObject(): IPty {

		return this.factoryObject as IPty;
	}
}

/**
 * The parameters to build the pty process.
 */
export type PtyFactoryParams = {

	terminal: XTerminal;
	shell: string;
	cwd: string;
}
