import React from 'react';
import { Pane, Spinner } from 'evergreen-ui'

const LoadingSpinner: React.FC = () => (
    <Pane display="flex" alignItems="center" justifyContent="center" height={200}>
        <Spinner />
    </Pane>)

export default LoadingSpinner;