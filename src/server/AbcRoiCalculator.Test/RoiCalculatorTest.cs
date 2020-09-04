using AbcRoiCalculatorApp.Models;
using ExchangeRateServiceClient;
using ExchangeRatesService;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbcRoiCalculator.Test
{
    [TestFixture]
    public class RoiCalculatorTest
    {

        public static IBusinessRules GetTestBusinessRules()
        {
            var businessRules = new RoiBusinessRules() { BaseCurrency = TestConstants.BaseCurrency, BaseFee = TestConstants.BaseFee, TargetCurrency = TestConstants.TargetCurrency };
            var houseMarketReturnTiers = new List<InvestmentOptionRule>()
            {
                new InvestmentOptionRule()
                {
                    From = 0,
                    To = 0.5,
                    Roi  = 0.1, // 10%
                    Fee  = 0.1
                },
                new InvestmentOptionRule()
                {
                    From = 0.5,
                    To = 1,
                    Roi  = 0.20, // 20%
                    Fee  = 0
                }
            };
            var cashDepositReturnTiers = new List<InvestmentOptionRule>()
            {
                new InvestmentOptionRule()
                {
                    From = 0,
                    To = 1,
                    Roi  = 0.025, // 2.5%
                    Fee  = 0.01 // 1% of ROI
                }
            };

            var investmentOptions = new List<InvestmentOption>() {
                new InvestmentOption()
                {
                    Id = 1,
                    Name = "House market",
                    Rules = houseMarketReturnTiers
                },
                new InvestmentOption()
                {
                    Id = 2,
                    Name = "Cash deposits",
                    Rules = cashDepositReturnTiers
                },
            };

            businessRules.InvestmentBusinessRules = investmentOptions;

            return businessRules;
        }

        [Test]
        public async Task RoiCalculationTest()
        {
            // Arrange
            var currencyConverter = new CurrencyConverter(TestMocks.GrpcClientMock());
            var businessRules = GetTestBusinessRules();
            const double investmentAmount = 100000;
            var calculator = new RoiCalculator(currencyConverter, businessRules);

            // This is "House market"
            var optionId = businessRules.InvestmentBusinessRules.First().Id; 

            // Invest 100% in the house market;
            var investionAllocation = new List<InvestmentOptionBase>()
            {
                new InvestmentOption()
                {
                    Id = optionId,
                    AllocatedProportion = 1
                }
            };
            var calculationRequest = new RoiCalculationRequest()
            {
                BaseCurrency = TestConstants.BaseCurrency,
                InvestmentAmount = investmentAmount,
                InvestmentOptions = investionAllocation
            };


            // Act
            var calculationResult = await calculator.Calculate(calculationRequest);

            // Assert
            // We expect a 20% ROI and just the base FEE, becuase house market doesn't have fee.
            const double expectedRoi = investmentAmount * 0.2 * TestConstants.AudUsdConversionRate;
            const double expectedFees = TestConstants.BaseFee * TestConstants.AudUsdConversionRate;
            
            Assert.AreEqual(calculationResult.Currency, TestConstants.TargetCurrency);
            Assert.AreEqual(calculationResult.Total, expectedRoi);
            Assert.AreEqual(calculationResult.Fees, expectedFees);
        }
    }
}
