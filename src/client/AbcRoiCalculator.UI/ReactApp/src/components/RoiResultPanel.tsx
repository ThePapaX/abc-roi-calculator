import React from 'react';
import { Pane, TextInputField } from 'evergreen-ui'
import { CurrencyFormatter } from '../utilities/numberFormaters';

const RoiResultPanel: React.FC<any> = (props) => {
    const currencyFormatter = new CurrencyFormatter(props.locale, props.result.currency);

    return (<Pane display="flex">
        <Pane flexGrow={2} float="left" margin={8}>
            <TextInputField margin={0}
                label="Projected return in 1 year"
                value={currencyFormatter.format(props.result.total)}
                disabled
            />
        </Pane>
        <Pane float="left" margin={8}>
            <TextInputField margin={0}
                label="Total fees"
                value={currencyFormatter.format(props.result.fees)}
                disabled
            />
        </Pane>

    </Pane>)
}

export default RoiResultPanel;