import * as React from 'react';
import { InvestmentOption, InvestmentOptionGroup, InvestmentRowsState, rowValidationDictionary } from '../store/RoiCalculator';

import { Pane, TextInputField, Select, Badge, Text, Heading, IconButton, CrossIcon, PlusIcon, Button } from 'evergreen-ui';
import InvestmentOptionRow from './InvestmentOptionRow';


type RowEvent = (groupdId : number, value? : any) => any;

export interface InvestmentOptionsListProps {
    investmentRowsState : InvestmentRowsState,
    rowsValidation? : rowValidationDictionary,

    investmentOptions: Array<InvestmentOption>,
    investmentAllocation: Array<InvestmentOptionGroup>,
    maxRowCount : number,

    onOptionSelected: RowEvent,
    onOptionRemoved: RowEvent,
    onOptionAdded: RowEvent,
    onAllocationChanged : RowEvent,
};

const InvestmentOptionsList: React.FC<InvestmentOptionsListProps> = (props => {
    const [nextId, setNextId] = React.useState(10); //Just an internal variable to generate keys and groupId.
    const [disableAddOption, setDisableAddOption] = React.useState(false);
    const minRowCount = 1;
    

    // Check everytime the number of rows changes to see if we need to disable Adding new rows.
    React.useEffect(() => {
        setDisableAddOption(props.investmentAllocation.length >= props.maxRowCount);
    }, [props.investmentAllocation.length]);

    function addOption() {
        props.onOptionAdded(nextId);
        setNextId(nextId+1);
    }
    
    // Minimum 1 row is controlled locally on this component.
    function onOptionRemovedDispatcher(groupdId : number){
        if(props.investmentAllocation.length > minRowCount){
            props.onOptionRemoved(groupdId);
        }
    }

    return (<Pane clearfix marginTop={24}>
        <Heading>Investment options:</Heading>
        {props.investmentAllocation.map(investmentOption =>
            (
                <InvestmentOptionRow
                    key={investmentOption.groupId}
                    groupId={investmentOption.groupId}
                    investmentOptions={props.investmentOptions}
                    onOptionSelected={(groupId: number, value: number) => { props.onOptionSelected(groupId, value) }}
                    onAllocationChanged={(groupId: number, value: number) => { props.onAllocationChanged(groupId, value) }}
                    currentInvestmentOption = {investmentOption}
                    onRemove={onOptionRemovedDispatcher}
                    validation={props.rowsValidation && props.rowsValidation[investmentOption.groupId]}
                />
            )
        )}
        <Pane float="right" margin={8}>
            <IconButton icon={<PlusIcon color="white" />} disabled={disableAddOption} appearance="primary" intent="none" onClick={addOption} />
        </Pane>
    </Pane>)

})

export default InvestmentOptionsList;