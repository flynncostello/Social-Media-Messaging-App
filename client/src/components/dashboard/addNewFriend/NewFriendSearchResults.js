import React, { useState, useEffect } from 'react';
import { selectFriends } from '../../../slices/friendsSlice';
import { selectUser } from '../../../slices/userSlice';
import { useSelector } from 'react-redux';
import userAPI from '../../../api/user';
import NewFriendSearchResult from './NewFriendSearchResult';
import './NewFriendSearchResults.css';

const NewFriendSearchResults = ({ searchValue }) => {
    const [results, setResults] = useState([]); // Array of objects each with an id and usersname (i.e., possible friends ids and usernames)
    const user_id = useSelector(selectUser).id;
    const friends = Object.values(useSelector(selectFriends)); // Each friend_id proprty of each key-value pair will need to be checked for duplicates

    useEffect(() => {
        const getSearchResults = async () => {
            try {
                const searchResults = await userAPI.searchUsers(searchValue, user_id, friends);
                setResults(searchResults);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        getSearchResults();
    }, [searchValue]);

    return (
        <div className='search-results-container'>
            <h3>Search Results</h3>
            <ul className='results-container'>
                {results.map((result) => (
                    <NewFriendSearchResult key={result.id} id={result.id} username={result.username} />
                ))}
            </ul>
        </div>
    );
};

export default NewFriendSearchResults;