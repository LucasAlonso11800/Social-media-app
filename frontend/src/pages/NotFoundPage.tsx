import React from 'react'
import Error404 from '../assets/Error404.png';
import { Container, Image } from 'semantic-ui-react'

export default function NotFoundPage() {
    return (
        <Container className="not-found__container">
            <Image
                className="not-found__image"
                src={Error404}
            />
            <h1 className="not-found__title">Page Not Found</h1>
            <p className="not-found__subtitle">It seems that we couldn't find the page you were looking for</p>
            <p className="not-found__subtitle">This user or post might not exist anymore</p>
            <p className="not-found__disclaimer">(Or you may have been blocked)</p>
        </Container>
    )
};