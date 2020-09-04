using AbcRoiCalculatorApp.Models;
using NUnit.Framework;
using System.Collections.Generic;

namespace AbcRoiCalculator.Test
{
    [TestFixture]
    public class InvestmentOptionsIndividualRoiAndFeeTests
    {
        private List<InvestmentOptionRule> _rules;

        [OneTimeSetUp]
        public void Setup()
        {
            _rules = new List<InvestmentOptionRule>()
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
        }

        [TestCase(1000, 0, 0, 0)]
        [TestCase(1000, 300, 30, 3)]
        [TestCase(1000, 500, 50, 5)]
        [TestCase(1000, 600, 120, 0)]
        [TestCase(1000, 1000, 200, 0)]
        public void OptionRoiReturnsCorrectValueAndFeeForTheOption(double totalInvestement, double investedAmountInOption, double expectedRoi, double expectedFee)
        {
            // Arrange
            var investmentProportion = investedAmountInOption / totalInvestement;

            /*var lessThanFiftyPercentRule = new InvestmentOptionRule()
            {
                From = 0,
                To = 0.5,
                Roi = 0.1, // 10%
                Fee = 0.1
            };
            var moreThanFiftyPercentRule = new InvestmentOptionRule()
            {
                From = 0.5,
                To = 1,
                Roi = 0.20, // 20%
                Fee = 0
            };
            investmentOption.Rules.Add(lessThanFiftyPercentRule);
            investmentOption.Rules.Add(moreThanFiftyPercentRule);
            */
            var investmentOption = new InvestmentOption();
            investmentOption.Rules = _rules;

            // Act
            var optionRoiResult = investmentOption.CalculateRoiForAmount(investedAmountInOption, investmentProportion);

            // Assert
            Assert.AreEqual(optionRoiResult.Value, expectedRoi);
            Assert.AreEqual(optionRoiResult.Fee, expectedFee);
        }

    }
}