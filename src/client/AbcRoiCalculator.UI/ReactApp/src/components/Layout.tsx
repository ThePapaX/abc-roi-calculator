import * as React from 'react';

import { Pane, Heading } from 'evergreen-ui'

export default (props: { children?: React.ReactNode }) => (
    <Pane display="flex" justifyContent="flex-start" alignItems="center" flexDirection="column" margin={32}>
        <Pane className="main-pane"
            elevation={2}
            padding={32}
            width={800}
            maxWidth={"100%"}

        >
            <Heading size={800} marginBottom={24}>Abc Company Inc, ROI Calculator</Heading>
            {props.children}
        </Pane>
    </Pane>
);