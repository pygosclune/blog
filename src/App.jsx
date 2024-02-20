import { useState, useEffect } from 'react'
import axios from 'axios';
import { Button, Card, CardBody } from "@nextui-org/react";

import PostList from './components/PostList';
import Login from './components/Login';

export default function App() {
    const BASE_URL = 'http://localhost:3000/api/v1';
    const axiosInstance = axios.create({
        baseURL: BASE_URL
    });
    const [page, setPage] = useState('home');
    const [loggedIn, setLoggedIn] = useState(false);

    // check if we can get posts, so check if we are already authorized
    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem('token'));
        //we need to check if token is NOT expired
        if (storedToken) {
            const config = {
                headers: { Authorization: `Bearer ${storedToken}` }
            };

            axiosInstance.get('/posts', config)
            .then(() => {
                setLoggedIn(true);
            })
            .catch(() => {
                // TODO add responses codes catches, so it wont go false if server gone down
                setLoggedIn(false);
            })
        }
    }, [])

    function handleLogout () {
        setPage('home')
        setLoggedIn(false);
        localStorage.removeItem('token');
    };

    if (page === 'login') {
        return (
            <div className='loginpage'>
                <nav className="flex gap-2 mb-8">
                    <Button onClick={() => {setPage('home')}}>Homepage</Button>
                    <Button onClick={() => {setPage('posts')}}>Posts</Button>
                    {loggedIn ? <Button onClick={handleLogout}>Log out</Button> : <Button isDisabled>Log in</Button>}
                </nav>

                <Login axiosInstance={axiosInstance} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setPage={setPage}/>
            </div>
        );
    }

    if (page === 'posts') {
        return (
            <div className="postspage">
                <nav className="flex gap-2 mb-8">
                    <Button onClick={() => {setPage('home')}}>Homepage</Button>
                    <Button isDisabled>Posts</Button>
                    {loggedIn ? <Button onClick={handleLogout}>Log out</Button> : <Button onClick={() => {setPage('login')}}>Log in</Button>}
                </nav>

                {loggedIn ? <PostList axiosInstance={axiosInstance} /> : <p>Not logged in!</p>}
            </div>
        );
    }

    return (
        <div className="homepage">
            <nav className="flex gap-2 mb-8">
                <Button isDisabled>Homepage</Button>
                <Button onClick={() => {setPage('posts')}}>Posts</Button>
                {loggedIn ? <Button onClick={handleLogout}>Log out</Button> : <Button onClick={() => {setPage('login')}}>Log in</Button>}
            </nav>

            <Card>
                <CardBody>
                    <p>This is homepage!!!</p>
                </CardBody>
            </Card>
        </div>
    );
}