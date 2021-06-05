// Load snapshot
require('../common/v8-snapshot');

import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import ConfigContext from '@ui/contexts/ConfigContext';
import AuthContext from '@ui/contexts/AuthContext';
import BlocksProvider from '@ui/contexts/NotificationsContext';
import WindowsProvider from '@ui/contexts/WindowsContext';
import HostsContext from '@ui/contexts/HostsContext';

if(module.hot)
    module.hot.accept();

const root = document.getElementById('app');
const LazyApp = lazy(() => import('./App'));

render(
    <BlocksProvider>
        <ConfigContext>
            <HostsContext>
                <AuthContext>
                    <WindowsProvider>
                        <Suspense fallback={null}>
                            <LazyApp />
                        </Suspense>
                    </WindowsProvider>
                </AuthContext>
            </HostsContext>
        </ConfigContext>
    </BlocksProvider>, root);
