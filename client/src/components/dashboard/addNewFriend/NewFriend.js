import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

import NewFriendSearchResults from './NewFriendSearchResults';

import './NewFriend.css';

const NewFriend = () => {
    const [showTab, setShowTab] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleIconClick = () => {
        setShowTab(!showTab);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <div className='new-friend-container'>
            <FontAwesomeIcon icon={faUserPlus} className='new-friend-icon' onClick={handleIconClick} />
            {showTab && (
                <div className='new-friend-tab-container'>
                    <h2>Add New Friend</h2>
                    <input type="text" placeholder="Search" value={searchValue} onChange={handleSearchChange} />
                    <div className='search-results'>
                        <NewFriendSearchResults searchValue={searchValue} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewFriend;


