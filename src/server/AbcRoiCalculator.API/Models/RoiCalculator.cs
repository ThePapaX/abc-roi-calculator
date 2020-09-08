using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class RoiCalculator : IRoiCalculator
    {
        private readonly ICurrencyConverter _currencyConverter;
        private readonly IBusinessRules _roiConfiguration;

        public RoiCalculator(ICurrencyConverter currencyConverter, IBusinessRules roiConfiguration)
        {
            _currencyConverter = currencyConverter;
            _roiConfiguration = roiConfiguration;
        }

        public async Task<RoiCalculationResult> Calculate(RoiCalculationRequest request)
        {
            var roi = new RoiCalculationResult()
            {
                Currency = _roiConfiguration.BaseCurrency, //It will be change to target currency once an actual conversion is applied.
                Total = 0,
                Fees = _roiConfiguration.BaseFee
            };

            // Apply each rule to investment allocation and amount;
            request.InvestmentOptions.ForEach(option =>
            {
                var investmentOptionInformation = _roiConfiguration.InvestmentBusinessRules.Find(op => op.Id == option.Id);

                if (investmentOptionInformation is null)
                {
                    throw new Exception("INVALID_OPTION");
                }

                var investmentAmountForOption = request.InvestmentAmount * option.AllocatedProportion;

                var optionRoi = investmentOptionInformation.CalculateRoiForAmount(investmentAmountForOption, option.AllocatedProportion);

                roi.Total += optionRoi.Value;
                roi.Fees += optionRoi.Fee;
            });

            try
            {
                await _currencyConverter.Convert(roi, _roiConfiguration.BaseCurrency, _roiConfiguration.TargetCurrency);
            }
            catch (Exception ex)
            {
                // TODO: log this exception.
                Debug.Write(ex);
                // If something happens with the Fx rates service we just return in the same currency.
            }

            return roi;
        }
    }
}