import * as React from 'react';
import { InvestmentOption, InvestmentOptionGroup } from '../store/RoiCalculator';

import { Pane, TextInputField, Select, Badge, Text, Heading, IconButton, CrossIcon, PlusIcon, Button } from 'evergreen-ui';
import InvestmentOptionRow from './InvestmentOptionRow';


export interface InvestmentOptionsListProps {

    investmentOptions: Array<InvestmentOption>,
    investmentAllocation: Array<InvestmentOptionGroup>

    onOptionSelected: Function,
    onOptionRemoved: Function,
    onOptionAdded: Function
};

type RowToOptionMap =  {
    groupId: number,
    optionId: number | null,
    allocation : number | null
};


const defaultRowToOptionMapState = (): Array<RowToOptionMap> => {
    let rows = [];
    for (let i = 0; i < 5; i++) {
        rows.push({ groupId: i, optionId : null, allocation : null })
    }
    return rows;
}

const InvestmentOptionsList: React.FC<InvestmentOptionsListProps> = (props => {
    const [rowToOptions, setRowToOptions] = React.useState(defaultRowToOptionMapState());
    const [nextId, setNextId] = React.useState(5);
    const [disableAddOption, setDisableAddOption] = React.useState(false);
    const minimunOptions = 1;
    const maximumOptions = props.investmentOptions.length;

    React.useEffect(() => {
        setDisableAddOption(rowToOptions.length >= maximumOptions);
    }, [rowToOptions.length]);

    function addOption() {
        const newOption: RowToOptionMap = { groupId: nextId, optionId: null, allocation : null };
        const newState = [...rowToOptions, newOption];

        setRowToOptions(newState);
        setNextId(nextId+1);
    }

    function removeOption(groupId: number) {
        setRowToOptions(rowToOptions.filter(opt => opt.groupId !== groupId));
    }

    return (<Pane clearfix marginTop={24}>
        <Heading>Investment options:</Heading>
        {rowToOptions.map(rowMap =>
            (
                <InvestmentOptionRow
                    key={rowMap.groupId}
                    groupId={rowMap.groupId}
                    investmentOptions={props.investmentOptions}
                    onOptionSelected={(groupId: number, value: number) => { console.warn('OPTION_SELECTED on group:', groupId, 'value:', value) }}
                    onAllocationChange={(groupId: number, value: number) => { console.warn('ALLOCATION_CHANGE on group:', groupId, 'value:', value) }}
                    onRemove={removeOption}
                />
            )
        )}
        <Pane float="right" margin={8}>
            <IconButton icon={<PlusIcon color="white" />} disabled={disableAddOption} appearance="primary" intent="none" onClick={addOption} />
        </Pane>
    </Pane>)

})

export default InvestmentOptionsList;