import { useState } from "react";
import { Button, ButtonGroup, Input, Spinner } from "@nextui-org/react";

export default function Login({ axiosInstance, loggedIn, setLoggedIn, setPage }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [pageState, setPageState] = useState('login');
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();
        try {
            setLoading(true);
            setError('');
            const response = await axiosInstance.post('/auth/login', { username, password });
            const { token } = response.data;
            localStorage.setItem('token', JSON.stringify(token));
            setLoggedIn(true);
            setPage('posts');
            setUsername('');
            setPassword('');
        } catch (error) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    async function handleSignUp(event) {
        event.preventDefault();
        try {
            setError('');
            setLoading(true);
            await axiosInstance.post('/auth/register', { username, password });
            setUsername('');
            setPassword('');
            setPageState('login');
            setError('Now login with your registered account!') // using setError, because it's nonsense to create new state just for this
        } catch (error) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    function handlePageChange(pageState) {
        setUsername('');
        setPassword('');
        setError('');
        if (pageState === 'login') {
            setPageState('login');
        } else {
            setPageState('signup');
        }
    }

    //if user is NOT logged in
    if (!loggedIn) {
        return (
            <div className="flex flex-col gap-2 items-center justify-center">
                <ButtonGroup>
                    <Button isDisabled={pageState === 'login'} onClick={() => handlePageChange('login')}>Log in</Button>
                    <Button isDisabled={pageState !== 'login'} onClick={() => handlePageChange('signup')}>Sign up</Button>
                </ButtonGroup>
                <h2>{pageState === 'login' ? 'Log in' : 'Sign up'}</h2>
                <form onSubmit={pageState === 'login' ? handleLogin : handleSignUp} className="flex flex-col items-start gap-4">
                    <Input isRequired type="text" label="Username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input isRequired type="password" label="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" isLoading={loading}>{pageState === 'login' ? 'Log in' : 'Sign up'}</Button>
                    <p>{error}</p>
                </form>
            </div>
        );
    } 
}