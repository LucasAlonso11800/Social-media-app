import React, { useState, useEffect } from 'react';
// Semantic
import { Form, Button } from 'semantic-ui-react';
// GraphQL
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../graphql/Mutations';
import { GET_POSTS } from '../graphql/Queries';
// Form
import { useFormik } from 'formik';
import * as yup from 'yup';
// Interfaces
import { ICreatePost, IPostQuery } from '../Interfaces';

const validationSchema = yup.object({
    body: yup.string().max(140, 'It can not be longer than 140 characters').required()
});

function PostForm() {
    const formik = useFormik({
        initialValues: {
            body: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => setQueryVariables(values)
    });

    const [queryVariables, setQueryVariables] = useState<ICreatePost>();

    const [createPost, { error, loading, data }] = useMutation(CREATE_POST, {
        update(proxy, result) {
            const data: IPostQuery = proxy.readQuery({
                query: GET_POSTS
            }) as IPostQuery;

            proxy.writeQuery({
                query: GET_POSTS,
                data: { all_posts: [result.data.create_post, ...data.all_posts] }
            })

            formik.values.body = ''
        },
        variables: queryVariables,
        onError: () => console.log('error'),
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
                <Button type="submit" color="twitter">
                    Post
                </Button>
            </Form.Group>
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

export default PostForm;