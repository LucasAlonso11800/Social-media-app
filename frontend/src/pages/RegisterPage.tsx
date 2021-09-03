import React, { useState, useEffect, useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
import { RouteComponentProps } from 'react-router';
// GraphQL
import { useMutation } from '@apollo/client';
import { ADD_PROFILE, ADD_USER } from '../graphql/Mutations';
// Semantic
import { Form, Button, Container, Select } from 'semantic-ui-react';
// Form
import * as yup from 'yup';
import { useFormik } from 'formik';
// Interfaces
import { IAddUser, EActionType } from '../Interfaces';
import { countries } from '../consts/Countries';

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validationSchema = yup.object({
    username: yup
        .string()
        .min(6, 'The username must be at least 6 characters long')
        .required('Username must be provided'),
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
        .oneOf([yup.ref('password')], "Passwords must be equal")
        .required('A password must be provided'),
    city: yup
        .string()
        .required('Please provide a city'),
    birthDate: yup
        .date()
        .max(new Date().toISOString().substring(0, 10), "You weren't born in the future!")
        .required('Please select a date'),
});

export default function RegisterPage(props: RouteComponentProps) {
    const { dispatch } = useContext(GlobalContext);
    const [queryVariables, setQueryVariables] = useState<IAddUser>();
    const [selectedCountry, setSelectedCountry] = useState('Argentina');

    const [addUser, { loading, error: addUserError, data }] = useMutation(ADD_USER, {
        update(proxy, result) {
            dispatch({
                type: EActionType.LOGIN,
                payload: result.data.add_user
            })
        },
        variables: queryVariables,
        onError: (): any => console.log(JSON.stringify(addUserError, null, 2))
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            city: '',
            birthDate: new Date().toISOString().substring(0, 10)
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if(addUserError !== undefined) return addUser();
            setQueryVariables({
                ...values,
                country: selectedCountry
            });
        }
    });

    const [addProfile, { error: addProfileError }] = useMutation(ADD_PROFILE, {
        onCompleted: () => props.history.push(`/user/${data?.add_user.username}`),
        variables: {
            userId: data?.add_user.id,
            profileName: data?.add_user.username
        },
        onError: (): any => console.log(JSON.stringify(addProfileError, null, 2))
    });

    useEffect(() => {
        if (queryVariables !== undefined) addUser();
    }, [queryVariables]);

    useEffect(() => {
        if (data !== undefined) addProfile(data)
    }, [data]);

    return (
        <Container>
            <Form onSubmit={formik.handleSubmit} className={loading ? 'loading' : ''} noValidate>
                <h1>Create your account</h1>
                <Form.Input
                    name="username"
                    label="Username (Minimum length 6 characters)"
                    placeholder="Choose an username"
                    type="text"
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    value={formik.values.username}
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
                    name="email"
                    label="Email"
                    placeholder="Choose an email"
                    type="email"
                    value={formik.values.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email &&
                    <div className="ui red message">
                        <ul className="list">
                            <li>{formik.errors.email}</li>
                        </ul>
                    </div>
                }
                <Form.Input
                    name="password"
                    label="Password (Minimum length 8 characters)"
                    placeholder="Choose a password"
                    type="password"
                    value={formik.values.password}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    onChange={formik.handleChange}
                />
                {formik.touched.password && formik.errors.username &&
                    <div className="ui red message">
                        <ul className="list">
                            <li>{formik.errors.password}</li>
                        </ul>
                    </div>
                }
                <Form.Input
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="Confirm password"
                    type="password"
                    value={formik.values.confirmPassword}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    onChange={formik.handleChange}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword &&
                    <div className="ui red message">
                        <ul className="list">
                            <li>{formik.errors.confirmPassword}</li>
                        </ul>
                    </div>
                }
                <div className="field">
                    <label>Country</label>
                    <Select
                        name="country"
                        options={countries.map((country) => ({
                            key: country,
                            value: country,
                            text: country,
                            id: country,
                            name: country,
                        }))}
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.currentTarget.innerText)}
                    />
                </div>
                <Form.Input
                    name="city"
                    label="City"
                    placeholder="City"
                    type="text"
                    value={formik.values.city}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    onChange={formik.handleChange}
                />
                {formik.touched.city && formik.errors.city &&
                    <div className="ui red message">
                        <ul className="list">
                            <li>{formik.errors.city}</li>
                        </ul>
                    </div>
                }
                <Form.Input
                    name="birthDate"
                    label="Birth date"
                    type="date"
                    value={formik.values.birthDate}
                    error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                    onChange={formik.handleChange}
                />
                {formik.touched.birthDate && formik.errors.birthDate &&
                    <div className="ui red message">
                        <ul className="list">
                            <li>{formik.errors.birthDate}</li>
                        </ul>
                    </div>
                }
                <Button type="submit" color="twitter" disabled={loading} className="form__submit-button">
                    Register
                </Button>
                {addUserError !== undefined ?
                    <div className="ui red message form__submit-button">
                        <ul className="list">
                            <li>{addUserError.message}</li>
                        </ul>
                    </div>
                    : null}
            </Form>
        </Container>
    )
};