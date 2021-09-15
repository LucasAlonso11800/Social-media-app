import React, { useState, useEffect } from 'react';
// Semantic
import { Form, Button } from 'semantic-ui-react';
// GraphQL
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../graphql/Mutations';
import { GET_POSTS_FROM_USER } from '../graphql/Queries';
// Form
import { useFormik } from 'formik';
import * as yup from 'yup';
// Interfaces
import { ICreatePost, IPost } from '../Interfaces';

type Props = {
    userId: string
};

type QueryResult = {
    posts_from_user: IPost[]
};

const validationSchema = yup.object({
    body: yup.string().max(140, 'It can not be longer than 140 characters').required("Post can't be empty")
});

export default function PostForm(props: Props) {
    const { userId } = props;
    const [queryVariables, setQueryVariables] = useState<ICreatePost>();

    const formik = useFormik({
        initialValues: { body: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => setQueryVariables(values)
    });

    const [createPost, { error, loading }] = useMutation(CREATE_POST, {
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
        variables: queryVariables,
        onError: (): any => console.log(JSON.stringify(error, null, 2)),
    });

    useEffect(() => {
        if (queryVariables) createPost()
    }, [queryVariables]);

    return (
        <Form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            <h2>Create post</h2>
            <Form.Group style={{ width: '100%', margin: 0 }}>
                <Form.Field width="16">
                    <Form.Input
                        placeholder="What are you thinking about?"
                        name="body"
                        type="text"
                        value={formik.values.body}
                        onChange={formik.handleChange}
                        error={formik.touched.body && Boolean(formik.errors.body)}
                    />
                </Form.Field>
                <Button type="submit" color="twitter" disabled={loading}>
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