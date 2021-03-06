import React, { FC, ReactElement, useEffect, useContext } from 'react';
import Window from '@ui/windows/Window';
import Navbar from '@ui/components/navbar/Navbar';
import { remote } from 'electron';
import ShortcutsListener from '@ui/utils/ShortcutsListener';
import Notifications from '@ui/components/notifications/Notifications';
import { ConfigContext } from '@ui/contexts/ConfigContext';
import { WindowsContext } from '@ui/contexts/WindowsContext';
import useOpenPath from '@ui/hooks/useOpenPath';
import './styles/app.scss';

const App: FC = (): ReactElement => {

    const { windows, dispatch } = useContext(WindowsContext);
    const selected = windows.find((current) => current.selected);
    const config = useContext(ConfigContext);
    const openPath = useOpenPath();

    /**
     * Find if the current selected terminal has been destroyed. If so,
     * focus the terminal with the smallest id. If there are now windows
     * left, we close the window.
     */
    useEffect(() => {

        if(selected)
            return;

        if(windows.length >= 1) {

            const window = windows[0];
            dispatch({ type: 'SELECT', window });

        } else
            remote.getCurrentWindow().close();

    }, [windows]);

    const { image, opacity } = config.backgroundImage;
    const backgroundImage = `url(${image.startsWith('http') ? '' : 'squid://'}${image})`;

    return (
        <>
            <ShortcutsListener config={config}>
                <div className="main" style={{ backgroundColor: config.theme.background }}>
                    {
                        config.backgroundImage.enabled &&
                        <div className="background" style={{ backgroundImage, opacity }} />
                    }
                    <Navbar />
                    {
                        windows.map((window) =>
                            <Window
                                key={window.id}
                                config={config}
                                window={window}
                                openPath={openPath} />
                        )
                    }
                    {/* TODO set border ? */}
                    {/* <div className="border" style={{ boxShadow: `0 0 0 1px inset ${config.theme.border}` }} /> */}
                    <Notifications />
                </div>
            </ShortcutsListener>
            <style>{ config.css }</style>
        </>
    );
}

export default App;
