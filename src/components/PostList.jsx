import { useState, useEffect } from "react";
import ErrorPage from "./ErrorPage";
import { Card, CardBody, CardHeader, Avatar, Button, Modal, useDisclosure, ModalHeader, ModalFooter, ModalBody, Textarea, Checkbox, Input, ModalContent, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { DeleteIcon } from "./DeleteIcon";

export default function PostList({ axiosInstance }) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [postError, setPostError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState('');
    const [loggedUser, setLoggedUser] = useState(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const onDeleteOpen = () => {
        setIsDeleteOpen(true);
    };

    const onDeleteOpenChange = () => {
        setIsDeleteOpen(!isDeleteOpen);
    };

    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem('token'));

        if (storedToken) {
            const config = {
                headers: { Authorization: `Bearer ${storedToken}` }
            };

            axiosInstance.get('/posts', config)
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setError(401);
                } else {
                    console.error('Error while fetching posts', error);
                }
            })
            .finally(() => setLoading(false));

            axiosInstance.get('/user', config)
            .then(response => {
                setLoggedUser(response.data);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setError(401);
                } else {
                    console.error('Error while fetching user', error);
                }
            })
        } else {
            setError(401);
        }
    }, [isChanged]);

    async function createPost(event) {
        event.preventDefault();
        try {
            const storedToken = JSON.parse(localStorage.getItem('token'));

            if (storedToken) {
                const config = {
                    headers: { Authorization: `Bearer ${storedToken}` }
                };
                await axiosInstance.post('/posts', { title, content, published: isPublished }, config);
                setTitle('');
                setContent('');
                setIsPublished(false);
                setIsChanged(isChanged + 'post'); //rerender to show our new added post
            }
        } catch (error) {
            setPostError('Failed to create post!');
        }
    }

    async function deletePost(event, postIdToDelete) {
        event.preventDefault();
        try {
            const storedToken = JSON.parse(localStorage.getItem('token'));

            if (storedToken) {
                const config = {
                    headers: { Authorization: `Bearer ${storedToken}` }
                };
                await axiosInstance.delete(`/posts/${postIdToDelete}`, config);
                setIsChanged(isChanged + 'delete'); //rerender to refresh post list
            }
        } catch (error) {
            setPostError('Failed to delete post!');
        }
    }

    if (error === 401) {
        return (<><p className="flex justify-center">You are not logged in!</p></>);
    } else if (error) {
        return (<><ErrorPage error={error}/></>);
    };

    if (loading) return (<p>Loading...</p>);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-4">
                <h1>Post list</h1>
                <Button onPress={onOpen} color="primary">Add post</Button>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <h1>Add post</h1>
                                </ModalHeader>
                                <form onSubmit={createPost}>
                                    <ModalBody className="flex flex-col items-start gap-4">
                                            <Input type="text" label="Title" onValueChange={setTitle} />
                                            <Textarea
                                                label="Content"
                                                placeholder="Enter your content"
                                                className="max-w-xs"
                                                onValueChange={setContent}
                                            />
                                            <Checkbox
                                                label="Visible"
                                                color="primary"
                                                isSelected={isPublished}
                                                onValueChange={setIsPublished}
                                            >Visible</Checkbox>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button type="submit" color="primary" onPress={onClose}>Add post</Button>
                                    </ModalFooter>
                                </form>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                
            </div>
            {posts.map(post => ( //we are using map, but there are better solutions for more posts
                <Card key={post._id}>
                    <CardHeader className="flex gap-2">
                        <Avatar name={post.author.username} />
                        <h1 className="font-bold text-large">{post.title}</h1>
                        {post.author._id === loggedUser ?
                        <>
                            <Button onPress={onDeleteOpen} color="danger" variant="bordered" isIconOnly aria-label="Delete post"><DeleteIcon /></Button>
                            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                                <ModalContent>
                                    {(onDeleteClose) => (
                                        <>
                                            <ModalHeader className="flex flex-col gap-1">Delete post</ModalHeader>
                                            <form onSubmit={(event) => deletePost(event, post._id)}>
                                                <ModalBody>
                                                    <p>Are you sure to delete post?</p>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button onPress={onDeleteClose}>Close</Button>
                                                    <Button color="danger" type="submit" onPress={onDeleteClose}>Delete</Button>
                                                </ModalFooter>
                                            </form>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                        </>
                        : null}
                    </CardHeader>
                    <CardBody>
                        <p>{post.content}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}