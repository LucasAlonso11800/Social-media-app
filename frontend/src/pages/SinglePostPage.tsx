import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import moment from 'moment';
// GraphQL
import { useQuery } from '@apollo/client'
import { GET_SINGLE_POST, GET_USER_IMAGE } from '../graphql/Queries'
// Interfaces
import { ILike, ISinglePostQuery } from '../Interfaces';
import { Button, Card, Grid, Image, Icon, Label, Container, Dimmer, Loader } from 'semantic-ui-react';
// Components
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png'
// Context
import { GlobalContext } from '../context/GlobalContext';

export default function SinglePostPage(props: RouteComponentProps) {
    const { state } = useContext(GlobalContext);

    const username = window.location.pathname.split('/')[2];
    const postId = window.location.pathname.split('/')[3];

    const deleteCallback = () => props.history.push("/");

    const { error, loading, data: post } = useQuery<ISinglePostQuery>(GET_SINGLE_POST, { variables: { id: postId } });
    const { data: image } = useQuery(GET_USER_IMAGE, { variables: { username } });

    return (
        <Container>
            <Grid>
                <Grid.Row>
                    {loading ?
                        <Dimmer active={loading} inverted className="home-page__loader">
                            <Loader>Loading...</Loader>
                        </Dimmer> :
                        <Grid.Column width="16">
                            <Card fluid>
                                <Card.Content>
                                    <Image
                                        floated="right"
                                        className="post__user-image"
                                        size="small"
                                        src={image?.user_image.image ? `data:image/png;base64,${image?.user_image.image}` : ProfilePlaceholder}
                                    />
                                    <Card.Header>{post?.single_post.username}</Card.Header>
                                    <Card.Meta>{moment(post?.single_post.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{post?.single_post.body}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <LikeButton id={postId} likes={post?.single_post.likes as ILike[]} />
                                    <Button as="div" labelPosition="right">
                                        <Button basic color="twitter">
                                            <Icon name="comments" />
                                        </Button>
                                        <Label basic color="teal" pointing="left">
                                            {post?.single_post.comments.length}
                                        </Label>
                                    </Button>
                                    {state !== null && state.username === post?.single_post.username &&
                                        <DeleteButton postId={post?.single_post.id} callback={deleteCallback} />}
                                </Card.Content>
                            </Card>
                            {state ? <CommentForm postId={postId} /> : null}
                            {post?.single_post.comments.map(c => <Comment key={c.id} comment={c} postId={post?.single_post.id} />)}
                        </Grid.Column>
                    }
                </Grid.Row>
            </Grid>
        </Container>
    )
};