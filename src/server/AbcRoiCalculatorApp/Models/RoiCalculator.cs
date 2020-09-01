using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExchangeRateServiceClient;
using System.Diagnostics;

namespace AbcRoiCalculatorApp.Models
{
    public class RoiCalculator
    {
        readonly ExchangeRateServiceClient.ExchangeRateServiceClient _exchangeRateClient;
        readonly RoiConfigurationOptions _roiConfiguration;

        public RoiCalculator(ExchangeRateServiceClient.ExchangeRateServiceClient exchangeRateServiceClient, RoiConfigurationOptions roiConfiguration)
        {
            _exchangeRateClient = exchangeRateServiceClient;
            _roiConfiguration = roiConfiguration;
        }

        public async Task<double> GetConversionRate(string baseCurrency, string targetCurrency)
        {
            var ratesResponse = await _exchangeRateClient.GetRates(baseCurrency);
            ratesResponse.Rates.TryGetValue(targetCurrency, out double conversionRate);

            return conversionRate;
        }

        public async Task ConvertCurrency(RoiCalculationResult roi, string baseCurrency, string targetCurrency)
        {
            var conversionRate = await GetConversionRate(baseCurrency, targetCurrency);
            roi.Currency = targetCurrency;
            roi.Total *= conversionRate;
            roi.Fees *= conversionRate;
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
                var optionRules = _roiConfiguration.InvestmentBusinessRules.Find(op=> op.Id == option.Id);

                var investmentAmountForOption = request.InvestmentAmount * option.AllocatedProportion;

                var optionRoi = optionRules.CalculateRoiForAmount(investmentAmountForOption);

                roi.Total += optionRoi.Value;
                roi.Fees += optionRoi.Fee;
                
            });
            try { 
                await ConvertCurrency(roi, _roiConfiguration.BaseCurrency, _roiConfiguration.TargetCurrency);
            }
            catch (Exception ex)
            {
                Debug.Write(ex);
                // If something happens with the Fx rates service we just return in the same currency.
            }

            return roi;
        }
    }
}
