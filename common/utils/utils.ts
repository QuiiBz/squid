import electron from 'electron';
import { ITerminal } from '../../app/Terminal';

export const userDataPath = (electron.app || electron.remote.app).getPath('userData');
export const isWin = process.platform === 'win32';

const winPathRegex = /^[A-Z]:\\.+/;
const wslBasePath = '/mnt/';

/**
 * Resolve a windows path to a wsl compatible path, only if
 * the current shell is wsl.
 *
 * @param terminal - The ITerminal object
 * @param path - The path to resolve
 * @returns The path which work with wsl
 */
export function resolveToWSLPath(terminal: ITerminal, path: string): string {

	if(!terminal.shell.path.includes('wsl.exe'))
		return path;

	if(!winPathRegex.test(path))
		return path;

	const drive = path.charAt(0).toLowerCase();
	const wslPath = path.slice(2).replace(/\\/g, '/');

	return wslBasePath + drive + wslPath;
}

/**
 * Add quotes to a path if there are spaces in it.
 *
 * @param path - The path to add quotes to
 * @returns The quoted path
 */
export function addQuotes(path: string): string {

	if(!path.includes(' '))
		return path;

	return `"${path}"`;
}
