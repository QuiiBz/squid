import React, { Component, CSSProperties } from 'react';
import { IConfig } from '@common/config/Config';
import { Dispatch } from 'redux';
import { AppState, TerminalsAction } from '@app/store/types';
import { connect } from 'react-redux';
import { ITerminal, TerminalType } from '@app/Terminal';
import { remote } from 'electron';
import { UndefinedObject } from '@common/types/types';
import { createTerminal } from '@app/store/terminals/actions';
import { nextTerminalId } from '@common/utils/utils';
const { Menu, MenuItem } = remote;

interface Props {

	config: IConfig;
	terminals: ITerminal[];
	dispatch: (action: TerminalsAction) => void;
}

const mapStateToProps = (state: AppState) => ({

	terminals: state.terminals,
});

const mapDispatchToProps = (dispatch: Dispatch) => {

	return { dispatch: (action: TerminalsAction) => { dispatch(action) } }
}

class TabCreateTerminal extends Component<Props> {

	private menu: UndefinedObject<Electron.Menu>;

	constructor(props: Props) {

		super(props);
	}

	/**
	 * Set the shells of the menu.
	 */
	componentDidMount() {

		this.updateShells();
	}

	/**
	 * Update the shells menu if the config changed.
	 *
	 * @param prevProps - The previous props
	 */
	componentDidUpdate(prevProps: Readonly<Props>) {

		if(prevProps.config != this.props.config)
			this.updateShells();
	}

	render() {

		return (
			<>
				<button
					type="button"
					className="tab-create"
					onClick={() => this.createTerminal(this.props.config.defaultShell)}
					style={{ '--color': this.props.config.theme.text, '--hover': this.props.config.theme.textHover } as CSSProperties}>+</button>
				<button
					type="button"
					className="tab-create"
					onClick={() => this.openShells()}
					style={{ '--color': this.props.config.theme.text, '--hover': this.props.config.theme.textHover } as CSSProperties}>...</button>
			</>
		);
	}

	/**
	 * Update the shells by settings them in a Menu.
	 */
	private updateShells() {

		this.menu = new Menu();
		this.props.config.shells.forEach((shell) => {

			this.menu?.append(new MenuItem({

				label: shell.name,
				click: () => this.createTerminal(shell),
			}));
		});

		if(this.props.config.sshHosts && this.props.config.sshHosts.length >= 1) {

			this.menu?.append(new MenuItem({ type: 'separator' }));

			this.props.config.sshHosts.forEach((sshHost) => {

				this.menu?.append(new MenuItem({

					label: sshHost.name,
					click: () => this.createTerminal(sshHost),
				}));
			});
		}
	}

	/**
	 * Create a new terminal with the specified shell.
	 *
	 * @param terminalType - The terminal type to open
	 */
	private createTerminal(terminalType: TerminalType) {

		this.props.dispatch(createTerminal({
			id: nextTerminalId(this.props.terminals),
			name: 'Terminal',
			terminalType,
		}));
	}

	/**
	 * Open the shells menu.
	 */
	private openShells() {

		this.menu?.popup({ window: remote.getCurrentWindow() });
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TabCreateTerminal);
