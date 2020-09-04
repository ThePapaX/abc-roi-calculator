import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import validate from '../utilities/investmentValidator';
import { ChangeTabAction, InvestmentOptionRowAddedAction, InvestmentOptionRowRemovedAction, InvestmentOptionSelectedAction, InvestmentAmountChangedAction, KnownAction, InvestmentOptionAllocationChangedAction } from './Actions';
import { InvestmentOptionGroup, RoiCalculatorState, RoiCalculationResult, InvestmentOption } from './StoreDefs';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

const defaultInvestmentAllocationRows = (): Array<InvestmentOptionGroup> => {
    let rows = [];
    for (let i = 0; i < 5; i++) {
        rows.push({ groupId: i, id: -1, name: '' })
    }
    return rows;
}

const getApplicableInvestments = (investmentAllocation: Array<InvestmentOptionGroup>) =>
    investmentAllocation.filter(inv => inv.id > 0)
        .map(inv => ({ ...inv, allocatedProportion: (inv.allocatedProportion && inv.allocatedProportion / 100) }));


const defaultState: RoiCalculatorState = {
    currentTabIndex: 0,
    locale: 'en-au',
    currency: 'AUD',
    investmentAmount: 100000,
    investedPercentage: 0,
    tabs: ['Investment Options', 'ROI'],
    investmentOptions: [],
    investmentAllocation: defaultInvestmentAllocationRows(),
    validation: {
        isValid: false,
        hasValidated: false,
        errors: [],
        rowsValidation: {}
    },
    investmentRowsState: {
        rowCount: 5,
        canAddRows: true,
        canRemoveRows: true
    },
    result: {
        total: 0,
        fees: 0,
        currency: 'AUD',
    },
    isLoading: false
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    changeTab: (tabIndex: number) => ({ type: 'CHANGE_TAB', tabIndex } as ChangeTabAction),
    addInvestmentOption: (groupId: number) => ({ type: 'INVESTMENT_OPTION_ROW_ADDED', groupId } as InvestmentOptionRowAddedAction),
    removeInvestmentOption: (groupId: number) => ({ type: 'INVESTMENT_OPTION_ROW_REMOVED', groupId } as InvestmentOptionRowRemovedAction),
    setInvestmentOption: (groupId: number, optionId: number) => ({ type: 'INVESTMENT_OPTION_SELECTED', groupId, optionId } as InvestmentOptionSelectedAction),
    setInvestmentAllocation: (groupId: number, allocation: number) => ({ type: 'INVESTMENT_OPTION_ALLOCATION_CHANGED', groupId, allocation } as InvestmentOptionAllocationChangedAction),
    setInvestmentAmount: (investmentAmount: any) => ({ type: 'INVESTMENT_AMOUNT_CHANGED', investmentAmount } as InvestmentAmountChangedAction),

    calculateRoi: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        dispatch({ type: 'ROI_CALCULATION_REQUESTED' });
        /**
         * - Validate locally:
         * - Dispatch validation result
         * - ifValid then we proceed sending the request
         **/
        const { roiCalculator } = getState();
        const validationResult = validate(roiCalculator);

        dispatch({ type: validationResult.isValid ? 'VALIDATION_PASSED' : 'VALIDATION_FAILED', validation: validationResult });

        if (!validationResult.isValid) {
            return;
        }

        // If no changes have been made we don't need to send a new request.
        if (roiCalculator.shouldRecalculate === false) {
            dispatch({ type: 'CHANGE_TAB', tabIndex: 1 })
            return;
        }

        const roiRequestBody = {
            baseCurrency: roiCalculator.currency,
            investmentAmount: roiCalculator.investmentAmount,
            investmentOptions: getApplicableInvestments(roiCalculator.investmentAllocation)
        }

        fetch('/api/roi/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(roiRequestBody)
        })
            .then(response => response.json() as Promise<RoiCalculationResult>)
            .then(result => {
                dispatch({ type: 'ROI_CALCULATION_RECEIVED', result })
            })
            .catch(e => console.error(e));

    },

    requestInvestmentOptions: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.roiCalculator && appState.roiCalculator.investmentOptions.length === 0) {
            fetch('/api/roi')
                .then(response => response.json() as Promise<Array<InvestmentOption>>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_INVESTMENT_OPTIONS', investmentOptions: data });
                });

            dispatch({ type: 'REQUEST_INVESTMENT_OPTIONS' });
        }
    }

};

const addNewInvestmentOption = (state: RoiCalculatorState, groupId: number) => {
    const newInvestmentOption = { groupId, id: -1, name: '' };
    return { ...state, investmentAllocation: [...state.investmentAllocation, newInvestmentOption] };
}

const removeInvestmentOption = (state: RoiCalculatorState, groupId: number) => {
    return { ...state, investmentAllocation: state.investmentAllocation.filter(invesment => invesment.groupId !== groupId) };
}

const setInvestmentOptionForGroup = (state: RoiCalculatorState, groupId: number, optionId: number) => {
    const currentInvestments = state.investmentAllocation.map(inv => (inv.groupId === groupId) ? { ...inv, id: optionId } : inv)
    return { ...state, investmentAllocation: currentInvestments, shouldRecalculate: true, validation: { ...state.validation, hasValidated: false } }
}
const setInvestmentAllocationForGroup = (state: RoiCalculatorState, groupId: number, allocation: number) => {
    let investedPercentage = 0;
    const currentInvestments = state.investmentAllocation.map(inv => {
        if (inv.groupId === groupId) {
            inv = { ...inv, allocatedProportion: allocation }
        }
        investedPercentage += inv.allocatedProportion ? inv.allocatedProportion : 0;

        return inv;
    });
    return { ...state, investmentAllocation: currentInvestments, investedPercentage: investedPercentage, shouldRecalculate: true, validation: { ...state.validation, hasValidated: false } }
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
            return { ...state, currentTabIndex: action.tabIndex, isLoading: false };
        case 'INVESTMENT_AMOUNT_CHANGED':
            return { ...state, investmentAmount: action.investmentAmount, shouldRecalculate: true, validation: { ...state.validation, hasValidated: false } };
        case 'REQUEST_INVESTMENT_OPTIONS':
            return { ...state, isLoading: true };
        case 'RECEIVE_INVESTMENT_OPTIONS':
            return { ...state, isLoading: false, investmentOptions: action.investmentOptions };
        case 'INVESTMENT_OPTION_ROW_ADDED':
            return addNewInvestmentOption(state, action.groupId);
        case 'INVESTMENT_OPTION_ROW_REMOVED':
            return removeInvestmentOption(state, action.groupId);
        case 'INVESTMENT_OPTION_SELECTED':
            return setInvestmentOptionForGroup(state, action.groupId, action.optionId);
        case 'INVESTMENT_OPTION_ALLOCATION_CHANGED':
            return setInvestmentAllocationForGroup(state, action.groupId, action.allocation);
        case 'ROI_CALCULATION_REQUESTED':
            return { ...state, isLoading: true };
        case 'ROI_CALCULATION_RECEIVED':
            return { ...state, isLoading: false, currentTabIndex: 1, result: action.result, shouldRecalculate: false }
        case 'VALIDATION_FAILED':
            return { ...state, isLoading: false, validation: action.validation }
        case 'VALIDATION_PASSED':
            return { ...state, validation: action.validation }
        default:
            return state;
    }
};
