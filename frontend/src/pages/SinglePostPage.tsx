import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
// GraphQL
import { useQuery } from '@apollo/client'
import { GET_SINGLE_POST } from '../graphql/Queries'
// Interfaces
import { ILike, ISinglePostQuery } from '../Interfaces';
import { Button, Card, Grid, Image, Icon, Label, Container } from 'semantic-ui-react';
import moment from 'moment';
// Components
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
// Context
import { GlobalContext } from '../context/GlobalContext';

function SinglePostPage(props: RouteComponentProps) {
    const { state } = useContext(GlobalContext);
    const postId = window.location.pathname.substring(7);

    const deleteCallback = () => props.history.push("/");

    const { error, loading, data } = useQuery<ISinglePostQuery>(GET_SINGLE_POST, {
        variables: { id: postId }
    });

    return (
        <Container>
            <Grid>
                {loading ? <p>Loading post...</p> :
                    <Grid.Row>
                        <Grid.Column width="2">
                            <Image
                                floated="right"
                                size="small"
                                src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            />
                        </Grid.Column>
                        <Grid.Column width="14">
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>{data?.single_post.username}</Card.Header>
                                    <Card.Meta>{moment(data?.single_post.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{data?.single_post.body}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <LikeButton id={postId} likes={data?.single_post.likes as ILike[]} />
                                    <Button as="div" labelPosition="right">
                                        <Button basic color="twitter">
                                            <Icon name="comments" />
                                        </Button>
                                        <Label basic color="teal" pointing="left">
                                            {data?.single_post.comments.length}
                                        </Label>
                                    </Button>
                                    {state !== null && state.username === data?.single_post.username &&
                                        <DeleteButton postId={data?.single_post.id} callback={deleteCallback} />}
                                </Card.Content>
                            </Card>
                            {state ? <CommentForm postId={postId} /> : null}
                            {data?.single_post.comments.map(c => <Comment key={c.id} comment={c} postId={data?.single_post.id} />)}
                        </Grid.Column>
                    </Grid.Row>
                }
            </Grid>
        </Container>
    )
};

export default SinglePostPage;