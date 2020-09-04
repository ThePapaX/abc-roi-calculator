using AbcRoiCalculatorApp.Models;
using NUnit.Framework;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace AbcRoiCalculator.Test
{
    public class RoiCalculationRequestTest
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void InvestmentAmountCannotBeNegative()
        {
            // Arrange
            var calculationReq = new RoiCalculationRequest()
            {
                InvestmentAmount = -1,
            };

            // Act
            ValidationContext context = new ValidationContext(calculationReq);
            var result = calculationReq.Validate(context);

            // Assert
            Assert.IsTrue(result.Any(
                e => e.MemberNames.Contains(nameof(RoiCalculationRequest.InvestmentAmount)) &&
                e.ErrorMessage.Equals(ValidationMessages.INVALID_INVESTMENT_AMOUNT)));
        }

        [Test]
        public void InvestedAmountShouldBeOneHundredPercent()
        {
            // Arrange
            var calculationReq = new RoiCalculationRequest()
            {
                InvestmentAmount = 100000,
                InvestmentOptions = new List<InvestmentOptionBase>()
                {
                    new InvestmentOptionBase()
                    {
                        AllocatedProportion = .5
                    }
                }
            };

            // Act
            ValidationContext context = new ValidationContext(calculationReq);
            var result = calculationReq.Validate(context);

            // Assert
            Assert.IsTrue(result.Any(
                e => e.MemberNames.Contains(nameof(RoiCalculationRequest.InvestmentOptions)) &&
                e.ErrorMessage.Equals(ValidationMessages.TOTAL_INVESTMENT_ALLOCATION_MUST_BE_100_PERCENT)));
        }

        [Test]
        public void InvestmentOptionsCannotBeEmpty()
        {
            // Arrange
            var calculationReq = new RoiCalculationRequest();

            // Act
            ValidationContext context = new ValidationContext(calculationReq);
            var result = calculationReq.Validate(context);

            // Assert
            Assert.IsTrue(result.Any(
                e => e.MemberNames.Contains(nameof(RoiCalculationRequest.InvestmentOptions)) &&
                e.ErrorMessage.Equals(ValidationMessages.INVESTMENT_OPTIONS_CANNOT_BE_EMPTY)));
        }
    }
}