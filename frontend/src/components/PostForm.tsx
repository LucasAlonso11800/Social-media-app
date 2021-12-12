import React from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../graphql/Mutations';
import { GET_POSTS_FROM_USER } from '../graphql/Queries';
// Components
import { Form, Button } from 'semantic-ui-react';
// Form
import { useFormik } from 'formik';
import * as yup from 'yup';
// Interfaces
import { IPost, SnackbarActions } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    userId: string
    snackbarDispatch: React.Dispatch<SnackbarActions>
};

type QueryResult = {
    posts_from_user: IPost[]
};

const validationSchema = yup.object({
    body: yup.string().max(140, 'It can not be longer than 140 characters').required("Post can't be empty")
});

export default function PostForm(props: Props) {
    const { userId, snackbarDispatch } = props;

    const formik = useFormik({
        initialValues: { body: '' },
        validationSchema,
        onSubmit: () => handleSubmit()
    });

    const [createPost, { loading }] = useMutation(CREATE_POST, {
        update(proxy, result) {
            const data: QueryResult = proxy.readQuery({
                query: GET_POSTS_FROM_USER,
                variables: { userId }
            }) as QueryResult;

            proxy.writeQuery({
                query: GET_POSTS_FROM_USER,
                variables: { userId },
                data: { posts_from_user: [result.data.create_post, ...data.posts_from_user] }
            });

            formik.setFieldValue('body', '');
            formik.setTouched({ body: false });
        },
        variables: {
            body: formik.values.body
        },
        onError: (error): unknown => handleError(error, snackbarDispatch),
    });

    function handleSubmit() {
        createPost()
    };

    return (
        <Form onSubmit={formik.handleSubmit} style={{ width: '100%' }} data-testid="postForm">
            <h2>Create post</h2>
            <Form.Group style={{ width: '100%', margin: 0 }}>
                <Form.Field className="post-form__body-input">
                    <Form.Input
                        placeholder="What are you thinking about?"
                        name="body"
                        type="text"
                        value={formik.values.body}
                        onChange={formik.handleChange}
                        error={formik.touched.body && Boolean(formik.errors.body)}
                    />
                </Form.Field>
                <Button
                    type="submit"
                    color="twitter"
                    disabled={formik.values.body.trim() === '' || loading}
                    className="post-form__button"
                >
                    Post
                </Button>
            </Form.Group>
            {formik.touched.body && formik.errors.body &&
                <div className="ui red message">
                    <ul className="list">
                        <li>{formik.errors.body}</li>
                    </ul>
                </div>
            }
        </Form>
    )
};