import * as React from 'react';
import { InvestmentOption } from '../store/StoreDefs';

import { Pane, TextInputField, FormField, SelectField, IconButton, CrossIcon } from 'evergreen-ui'

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
    currentInvestmentOption?: InvestmentOption,
    onRemove: Function,
    onOptionSelected: Function,
    onAllocationChanged: Function
};

const optionValidationProps  = (validation? : InvestmentOptionRowValidationState)=>{
    const isInvalid = validation && !validation.option.isValid;
    return {
        isInvalid,
        validationMessage : isInvalid && validation && validation.option.message
    }
}

const allocationValidationProps  = (validation? : InvestmentOptionRowValidationState)=>{
    const isInvalid = validation && !validation.allocation.isValid;
    return {
        isInvalid,
        validationMessage : isInvalid && validation && validation.allocation.message
    }
}


const InvestmentOptionRow: React.FC<InvestmentOptionRowProps> = (props => {

    return (
        <Pane display="flex">
            <Pane flexGrow={2} float="left" margin={8}>
                <SelectField value={props.currentInvestmentOption && props.currentInvestmentOption.id} onChange={event => props.onOptionSelected(props.groupId, event.target.value)} {...optionValidationProps(props.validation)} width="100%" margin={0} label="" >
                    <option key={-1} value={-1} >--select--</option>
                    {props.investmentOptions.map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                </SelectField>
            </Pane>
            <Pane className={"percentage-input"} float="left" margin={8}>
                <TextInputField margin={0} width={150}
                    label="%"
                    type="number"
                    value={props.currentInvestmentOption && props.currentInvestmentOption.allocatedProportion}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onAllocationChanged(props.groupId, event.target.value ? parseFloat(event.target.value) : '')}
                    {...allocationValidationProps(props.validation)}
                />
            </Pane>
            <Pane float="left" margin={8}>
                <FormField label="">
                <IconButton icon={CrossIcon} onClick={()=> props.onRemove(props.groupId)} />
                </FormField>
            </Pane>
        </Pane>
    );
});

export default InvestmentOptionRow;