import React, { useState } from 'react';
import Email from './partial/person/Email';
import Linkedin from './partial/person/Linkedin';
import Id from './partial/person/Id';

const Person = () => {
    const [activeTab, setActiveTab] = useState('email'); // default active tab

    return (
        <div className='person_wrapper'>
            {/* Nav Tabs */}
            <nav className="nav gap-3 mb-5" id="nav-tab" role="tablist">
                <button
                    className={`nav-link ${activeTab === 'email' ? 'active' : ''}`}
                    onClick={() => setActiveTab('email')}
                    type="button"
                >
                    Email
                </button>
                <button
                    className={`nav-link ${activeTab === 'linkedin' ? 'active' : ''}`}
                    onClick={() => setActiveTab('linkedin')}
                    type="button"
                >
                    Linkedin
                </button>
                <button
                    className={`nav-link ${activeTab === 'id' ? 'active' : ''}`}
                    onClick={() => setActiveTab('id')}
                    type="button"
                >
                    ID
                </button>
            </nav>

            {/* Tab Content */}
            <div className="tab-content" id="nav-tabContent">
                {activeTab === 'email' && (
                    <div className="tab-pane email_tab fade show active">
                        <Email />
                    </div>
                )}
                {activeTab === 'linkedin' && (
                    <div className="tab-pane linkedin_tab fade show active">
                        <Linkedin />
                    </div>
                )}
                {activeTab === 'id' && (
                    <div className="tab-pane id_tab fade show active">
                        <Id />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Person;
