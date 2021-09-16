import React, { useState, useEffect, useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// GraphQL
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/Mutations';
// Components
import { Form, Button, Container } from 'semantic-ui-react';
// Form
import * as yup from 'yup';
import { useFormik } from 'formik';
// Interfaces
import { ILoginUser, EActionType } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';

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

export default function LoginPage() {
    const { dispatch } = useContext(GlobalContext);

    const [queryVariables, setQueryVariables] = useState<ILoginUser>();

    const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            dispatch({
                type: EActionType.LOGIN,
                payload: result.data.login_user
            });
            window.location.assign('/');
        },
        variables: queryVariables,
        onError: (error): unknown => handleError(error, undefined)
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (error !== undefined && queryVariables === values) return loginUser()
            setQueryVariables(values)
        }
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
                {formik.touched.username && formik.errors.username &&
                    <div className="ui red message">
                        <ul className="list">
                            <li>{formik.errors.username}</li>
                        </ul>
                    </div>
                }
                <Form.Input
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    value={formik.values.password}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    onChange={formik.handleChange}
                />
                {formik.touched.password && formik.errors.password &&
                    <div className="ui red message">
                        <ul className="list">
                            <li>{formik.errors.password}</li>
                        </ul>
                    </div>
                }
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
};