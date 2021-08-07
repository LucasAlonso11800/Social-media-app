import React, { useState, useEffect, useContext } from 'react';
// Semantic
import { Form, Button } from 'semantic-ui-react';
// GraphQL
import { useMutation } from '@apollo/client'
import { ADD_COMMENT } from '../graphql/Mutations';
// Interfaces
import { IAddComment } from '../Interfaces';
// Form
import { useFormik } from 'formik';
import * as yup from 'yup';

type Props = {
    postId: string
};

const validationSchema = yup.object({
    body: yup.string().max(140, 'It can not be longer than 140 characters').required("Comment must have a body")
});

function CommentForm(props: Props) {
    const [queryVariables, setQueryVariables] = useState<IAddComment>();

    const formik = useFormik({
        initialValues: {
            body: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => setQueryVariables(values)
    });

    const [addComment, { error }] = useMutation(ADD_COMMENT, {
        update() {
            formik.values.body = ""
        },
        variables: {
            body: queryVariables?.body,
            postId: props.postId
        },
        onError: () => console.log("Error")
    });

    useEffect(() => {
        if (queryVariables) addComment()
    }, [queryVariables]);

    return (
        <Form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            <h2>Comment this post</h2>
            <Form.Group style={{ width: '100%', margin: 0 }}>
                <Form.Field width="16">
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
                    disabled={formik.values.body.trim() === ''}
                    className="ui button"
                >
                    Comment
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
}

export default CommentForm
