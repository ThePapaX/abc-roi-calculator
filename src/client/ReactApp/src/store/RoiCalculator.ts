import { Action, Reducer, ActionCreatorsMapObject } from 'redux';
import { AppThunkAction } from './';
import { InvestmentOptionRowProps } from '../components/InvestmentOptionRow';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.


export interface InvestmentRowsState {
    rowCount : number,
    canAddRows : boolean,
    canRemoveRows : boolean
}

export interface RoiCalculatorState {
    currentTabIndex: number;
    tabs :  Array<string>;
    investmentOptions : Array<InvestmentOption>;
    investmentAllocation : Array<InvestmentOptionGroup>;
    validation : ValidationState;
    isLoading : boolean;
    investmentRowsState : InvestmentRowsState;
}

export interface InvestmentOption {
    id: number;
    name: string;
    allocatedProportion? : number;
}

export interface InvestmentOptionGroup extends InvestmentOption{
    groupId : number
}

export interface RoiCalculationResult {
    total : number,
    fees : number,
    currency : string,
    exchangeRateMetadata : any
}

export interface RoiCalculationRequest {
    baseCurrency : string,
    investmentAmount : number,
    investmentOptions : Array<InvestmentOption>
}

export interface ValidationError{
    type : string,
    property : string,
    message : string
}

export interface ValidationState {
    isValid : boolean,
    hasValidated : boolean,
    errors : Array<ValidationError>
}

const defaultInvestmentAllocationRows = (): Array<InvestmentOptionGroup> => {
    let rows = [];
    for (let i = 0; i < 5; i++) {
        rows.push({ groupId: i, id : -1, name : ''})
    }
    return rows;
}

const defaultState : RoiCalculatorState = {
    currentTabIndex : 0,
    tabs : ['Investment Options', 'ROI'],
    investmentOptions : [],
    investmentAllocation : defaultInvestmentAllocationRows(),
    validation : { 
        isValid : false, 
        hasValidated : false,
        errors : []
    },
    investmentRowsState : {
        rowCount : 5,
        canAddRows : true,
        canRemoveRows : true
    },
    isLoading : false
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface ChangeTabAction { 
    type: 'CHANGE_TAB';
    tabIndex: number 
}

export interface RequestRoiCalculationAction {
    type: 'REQUEST_ROI_CALCULATION';
    requestBody: RoiCalculationRequest;
}

export interface ReceiveRoiCalculationAction {
    type: 'RECEIVE_ROI_CALCULATION';
    result: RoiCalculationResult;
}

export interface RequestInvestmentOptionsAction {
    type: 'REQUEST_INVESTMENT_OPTIONS'
}

export interface ReceiveInvestmentOptionsAction {
    type: 'RECEIVE_INVESTMENT_OPTIONS';
    investmentOptions: Array<InvestmentOption>;
}


export interface InvestmentOptionRowAddedAction {
    type : 'INVESTMENT_OPTION_ROW_ADDED',
    groupId : number
}
export interface InvestmentOptionRowRemovedAction {
    type : 'INVESTMENT_OPTION_ROW_REMOVED',
    groupId : number
}


export interface InvestmentOptionSelectedAction {
    type : 'INVESTMENT_OPTION_SELECTED',
    groupId : number,
    optionId : number
}


export interface InvestmentOptionAllocationChangedAction {
    type : 'INVESTMENT_OPTION_ALLOCATION_CHANGED',
    groupId : number,
    allocation : number,
}
/*
onOptionSelected={(groupId: number, value: any)=>{ console.warn('OPTION_SELECTED on group:', groupId, 'value:', value)}}
            onOptionRemoved={(groupId: number, value: any)=>{ console.warn('ALLOCATION_CHANGE on group:', groupId, 'value:', value)}}
            onOptionAdded={()=>{}}
            onAllocationChanged={()=>{}}
*/
// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = ChangeTabAction | RequestRoiCalculationAction | ReceiveRoiCalculationAction | RequestInvestmentOptionsAction | ReceiveInvestmentOptionsAction | InvestmentOptionRowAddedAction | InvestmentOptionRowRemovedAction |  InvestmentOptionSelectedAction | InvestmentOptionAllocationChangedAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    changeTab: (tabIndex: number) => ({ type: 'CHANGE_TAB', tabIndex } as ChangeTabAction),
    addInvestmentOption : (groupId : number) => ({type : 'INVESTMENT_OPTION_ROW_ADDED', groupId} as InvestmentOptionRowAddedAction),
    removeInvestmentOption : (groupId : number) => ({type : 'INVESTMENT_OPTION_ROW_REMOVED', groupId} as InvestmentOptionRowRemovedAction),
    setInvestmentOption : (groupId : number, optionId : number)=> ({type : 'INVESTMENT_OPTION_SELECTED', groupId, optionId} as InvestmentOptionSelectedAction),
    setInvestmentAllocation : (groupId : number, allocation : number)=> ({type : 'INVESTMENT_OPTION_ALLOCATION_CHANGED', groupId, allocation} as InvestmentOptionAllocationChangedAction),

    
    requestInvestmentOptions: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.roiCalculator && appState.roiCalculator.investmentOptions.length === 0) {
            fetch(`https://localhost:44380/api/roi`)
                .then(response => response.json() as Promise<Array<InvestmentOption>>)
                .then(data => {
                    console.warn(data);
                    dispatch({ type: 'RECEIVE_INVESTMENT_OPTIONS', investmentOptions : data });
                });

            dispatch({ type: 'REQUEST_INVESTMENT_OPTIONS' });
        }
    }
    
};

const addNewInvestmentOption = (state : RoiCalculatorState, groupId : number)=>{
    const newInvestmentOption = {groupId, id : -1, name : ''};
    return { ...state, investmentAllocation: [...state.investmentAllocation, newInvestmentOption]};
}

const removeInvestmentOption = (state : RoiCalculatorState, groupId : number)=>{
    return { ...state, investmentAllocation: state.investmentAllocation.filter(invesment => invesment.groupId !== groupId)};
}

const setInvestmentOptionForGroup = (state : RoiCalculatorState, groupId : number, optionId : number)=>{
    const currentInvestments = state.investmentAllocation.map(inv => (inv.groupId === groupId) ? { ...inv, id: optionId } : inv)
    return { ...state, investmentAllocation : currentInvestments }
}
const setInvestmentAllocationForGroup = (state : RoiCalculatorState, groupId : number, allocation : number)=>{
    const currentInvestments = state.investmentAllocation.map(inv => (inv.groupId === groupId) ? { ...inv, allocatedProportion: allocation } : inv)
    return { ...state, investmentAllocation : currentInvestments }
}


// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<RoiCalculatorState> = (state: RoiCalculatorState | undefined, incomingAction: Action): RoiCalculatorState => {
    if (state === undefined) {
        return defaultState
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'CHANGE_TAB':
            return { ...state, currentTabIndex : action.tabIndex };
        case 'REQUEST_INVESTMENT_OPTIONS':
            return { ...state, isLoading : true };
        case 'RECEIVE_INVESTMENT_OPTIONS':
            return { ...state, isLoading : false, investmentOptions : action.investmentOptions };
        case 'INVESTMENT_OPTION_ROW_ADDED' :
            return addNewInvestmentOption(state, action.groupId);
        case 'INVESTMENT_OPTION_ROW_REMOVED' : 
            return removeInvestmentOption(state, action.groupId);
        case 'INVESTMENT_OPTION_SELECTED' :
            return setInvestmentOptionForGroup(state, action.groupId, action.optionId);
        case 'INVESTMENT_OPTION_ALLOCATION_CHANGED' : 
            return setInvestmentAllocationForGroup(state, action.groupId, action.allocation);
        default:
            return state;
    }
};