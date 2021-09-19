import React, { useState, useEffect } from 'react';
// GraphQL
import { useMutation } from '@apollo/client'
import { ADD_COMMENT } from '../graphql/Mutations';
import { GET_COMMENTS_FROM_POSTS } from '../graphql/Queries';
// Components
import { Form, Button } from 'semantic-ui-react';
// Interfaces
import { IAddComment, IComment } from '../Interfaces';
// Form
import { useFormik } from 'formik';
import * as yup from 'yup';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    postId: string
};

type MutationResult = {
    add_comment: IComment
};

type QueryResult = {
    comments_from_posts: IComment[]
};

const validationSchema = yup.object({
    body: yup.string().max(140, 'It can not be longer than 140 characters').required("Comment must have a body")
});

export default function CommentForm(props: Props) {
    const { postId } = props
    const [queryVariables, setQueryVariables] = useState<IAddComment>();

    const formik = useFormik({
        initialValues: { body: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => setQueryVariables(values)
    });

    const [addComment, { error, loading }] = useMutation<MutationResult>(ADD_COMMENT, {
        update(proxy, result) {
            const data: QueryResult = proxy.readQuery({
                query: GET_COMMENTS_FROM_POSTS,
                variables: { postId }
            }) as QueryResult;

            proxy.writeQuery({
                query: GET_COMMENTS_FROM_POSTS,
                variables: { postId },
                data: { comments_from_posts: [result.data?.add_comment, ...data.comments_from_posts] }
            });

            formik.setFieldValue('body', '');
            formik.setTouched({ body: false });
        },
        variables: {
            body: queryVariables?.body,
            postId
        },
        onError: (error): unknown => handleError(error, undefined)
    });

    useEffect(() => {
        if (queryVariables) addComment()
    }, [queryVariables]);

    return (
        <Form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            <h2>Comment this post</h2>
            <Form.Group style={{ width: '100%', margin: 0 }}>
                <Form.Field className="comment-form__body-input">
                    <Form.Input
                        fluid
                        placeholder="What would you like to say?"
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
                    className="comment-form__button"
                >
                    Comment
                </Button>
            </Form.Group>
            {formik.touched.body && formik.errors.body &&
                <div className="ui red message">
                    <ul className="list">
                        <li>{formik.errors.body}</li>
                    </ul>
                </div>
            }
            {error !== undefined ?
                <div className="ui red message">
                    <ul className="list">
                        <li>{error.message}</li>
                    </ul>
                </div>
                : null}
        </Form>
    )
};