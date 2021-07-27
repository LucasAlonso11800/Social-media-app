import React, { useState, useEffect, useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
import { RouteComponentProps } from 'react-router';
// GraphQL
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/Mutations';
// Semantic
import { Form, Button, Container } from 'semantic-ui-react';
// Form
import * as yup from 'yup';
import { useFormik } from 'formik';
// Interfaces
import { IAddUser } from '../Interfaces';

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validationSchema = yup.object({
    username: yup
        .string()
        .min(6, 'The usename must be at least 6 characters long')
        .required('An username must be provided'),
        email: yup
        .string()
        .matches(emailRegex, 'Provide a valid email')
        .required('An email must be provided'),
        password: yup
        .string()
        .min(8, 'The password must be at least 8 characters long')
        .required('A password must be provided'),
        confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], "Passworda must be equal")
        .required('A password must be provided')
    });
    
    function RegisterPage(props: RouteComponentProps) {
        const { state, dispatch } = useContext(GlobalContext);

        const formik = useFormik({
            initialValues: {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => setQueryVariables(values)
    });
    console.log(state)
    const [queryVariables, setQueryVariables] = useState<IAddUser>();

    const [addUser, { loading }] = useMutation(ADD_USER, {
        update(proxy, result) {
            dispatch({
                type: 'LOGIN',
                payload: result.data.add_user
            })
            props.history.push('/');
        },
        variables: queryVariables
    });

    useEffect(() => {
        if (queryVariables) addUser();
    }, [queryVariables])

    return (
        <Container>
            <Form onSubmit={formik.handleSubmit} className={loading ? 'loading' : ''} noValidate>
                <h1>Register</h1>
                <Form.Input
                    name="username"
                    label="Username"
                    placeholder="Choose an username"
                    type="text"
                    value={formik.values.username}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    onChange={formik.handleChange}
                />
                <Form.Input
                    name="email"
                    label="Email"
                    placeholder="Choose an email"
                    type="email"
                    value={formik.values.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    onChange={formik.handleChange}
                />
                <Form.Input
                    name="password"
                    label="Password"
                    placeholder="Choose a password"
                    type="password"
                    value={formik.values.password}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    onChange={formik.handleChange}
                />
                <Form.Input
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="Confirm password"
                    type="password"
                    value={formik.values.confirmPassword}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    onChange={formik.handleChange}
                />
                <Button type="submit" color="twitter" disabled={loading}>
                    Register
                </Button>
            </Form>
        </Container>
    )
}

export default RegisterPage