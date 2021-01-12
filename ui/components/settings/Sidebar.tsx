import React, { FC, ReactElement } from 'react';
import { SectionType } from '@ui/components/windows/Settings';

interface Props {

    section: SectionType;
    setSection: (section: SectionType) => void;
}

const Sidebar: FC<Props> = ({ section, setSection }: Props): ReactElement => {

    return (
        <div className="sidebar">
            <button className={section === 'profile' ? 'selected' : ''} onClick={() => setSection('profile')} type="button">Profile</button>
            <button className={section === 'about' ? 'selected' : ''} onClick={() => setSection('about')} type="button">About</button>
        </div>
    );
}

export default Sidebar;
