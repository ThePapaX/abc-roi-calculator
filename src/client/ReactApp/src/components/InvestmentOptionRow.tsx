import * as React from 'react';
import { InvestmentOption } from '../store/RoiCalculator';

import { Pane, TextInputField, TextInput, Select, Badge, Text, IconButton, CrossIcon } from 'evergreen-ui'

export interface InputValidationState {
    isValid: boolean,
    message: string
}

export interface InvestmentOptionRowValidationState {
    option: InputValidationState;
    allocation: InputValidationState,
}

export interface InvestmentOptionRowProps {
    groupId : number,
    validation?: InvestmentOptionRowValidationState,
    investmentOptions: Array<InvestmentOption>,
    selectedOption?: InvestmentOption,
    onRemove: Function,
    onOptionSelected: Function,
    onAllocationChange: Function
};

const InvestmentOptionRow: React.FC<InvestmentOptionRowProps> = (props => {
    return (
        <Pane display="flex" background="tint1">
            <Pane flexGrow={2} float="left" margin={8}>
                <Select value={props.selectedOption && props.selectedOption.id} onChange={event => props.onOptionSelected(props.groupId, event.target.value)} isInvalid={props.validation && !props.validation.option.isValid} width="100%">
                    <option key={-1} value={-1} >--select--</option>
                    {props.investmentOptions.map((option) => (
                        <option key={option.id} value={option.id} selected={props.selectedOption && props.selectedOption.id === option.id}>{option.name}</option>
                    ))}
                </Select>
            </Pane>
            <Pane  float="left" margin={8}>
                <TextInput width={150}
                    value={props.selectedOption && props.selectedOption.allocatedProportion}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onAllocationChange(props.groupId, event.target.value)}
                    isInvalid={props.validation && !props.validation.allocation.isValid}
                />
            </Pane>
            <Pane float="left" margin={8}>
                <IconButton icon={CrossIcon} onClick={()=> props.onRemove(props.groupId)} />
            </Pane>
        </Pane>
    );
});

export default InvestmentOptionRow;