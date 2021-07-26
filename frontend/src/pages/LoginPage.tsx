import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
// GraphQL
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/Mutations';
// Semantic
import { Form, Button, Container } from 'semantic-ui-react';
// Form
import * as yup from 'yup';
import { useFormik } from 'formik';
// Interfaces
import { ILoginUser } from '../Interfaces';

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validationSchema = yup.object({
    username: yup
        .string()
        .min(6, 'The usename must be at least 6 characters long')
        .required('An username must be provided'),
    password: yup
        .string()
        .min(8, 'The password must be at least 8 characters long')
        .required('A password must be provided'),
});

function LoginPage(props: RouteComponentProps) {
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => setQueryVariables(values)
    });

    const [queryVariables, setQueryVariables] = useState<ILoginUser>();

    const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            props.history.push('/');
        },
        variables: queryVariables,
        onError: () => console.log('Error')
    });

    useEffect(() => {
        if (queryVariables) loginUser();
    }, [queryVariables])

    return (
        <Container>
            <Form onSubmit={formik.handleSubmit} className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input
                    name="username"
                    label="Username"
                    placeholder="Username"
                    type="text"
                    value={formik.values.username}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    onChange={formik.handleChange}
                />
                <Form.Input
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    value={formik.values.password}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    onChange={formik.handleChange}
                />
                <Button type="submit" color="twitter" disabled={loading}>
                    Login
                </Button>
                {error !== undefined ?
                    <div className="ui red message">
                        <ul className="list">
                            <li>{error.message}</li>
                        </ul>
                    </div>
                    : null}
            </Form>
        </Container>
    )
}

export default LoginPage