import * as React from 'react';

import { Pane } from 'evergreen-ui'

export default (props: { children?: React.ReactNode }) => (
        <Pane display="flex" height="100vh" justifyContent="center" alignItems="center" flexDirection="column" padding={24}>
                <Pane className="main-pane"
                    elevation={1}
                    padding={32}
                    width={800}
                    maxWidth={"100%"}
                    
                >
            {props.children}
        </Pane>
        </Pane>
);
