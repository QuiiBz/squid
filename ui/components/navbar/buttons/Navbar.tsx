import React, { CSSProperties, FC, ReactElement, useState } from 'react';
import NavbarButton from '@ui/components/navbar/NavbarButton';
import { remote } from 'electron';
import Tabs from '@ui/components/tabs/Tabs';
import AuthButton from '@ui/components/navbar/buttons/SettingsButton';
import '@ui/styles/navbar.scss';
import { ConfigContext } from '@ui/contexts/ConfigContext';

const Navbar: FC = (): ReactElement => {

    const [maximized, setMaximized] = useState<boolean>(false);

    /**
     * Maximize or restore the current windows.
     */
    const maximize = () => {

        setMaximized(!maximized);
        maximized ? remote.getCurrentWindow().unmaximize() : remote.getCurrentWindow().maximize();
    }

    /**
     * Minimize the current windows.
     */
    const minimize = () => remote.getCurrentWindow().minimize();

    /**
     * Close the current windows.
     */
    const close = () => remote.getCurrentWindow().close();

    return (
        <ConfigContext.Consumer>
            { ({ theme }) => (
                <div className="navbar" style={{ '--border': theme.border } as CSSProperties }>
                    <Tabs />
                    <div className="buttons">
                        <AuthButton />
                        <NavbarButton
                            onClick={minimize}
                            path="M 0,5 10,5 10,6 0,6 Z" />
                        <NavbarButton
                            onClick={maximize}
                            path="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
                        <NavbarButton
                            onClick={close}
                            path="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
                    </div>
                </div>
            )}
        </ConfigContext.Consumer>
    );
}

export default Navbar;

