using AbcRoiCalculatorApp.Models;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace AbcRoiCalculator.Test
{
    [TestFixture]
    class InvestmentOptionRuleTests
    {
        [TestCase(0.1, 0.45)]
        [TestCase(0, 0)]
        [TestCase(1, 1)]
        public void LowerBoundTest(double lowerBound, double upperBound)
        {
            // Arrange
            var optionRule = new InvestmentOptionRule()
            {
                From = lowerBound,
                To = upperBound
            };

            // Act
            var isApplicable = optionRule.IsApplicableForProportion(lowerBound);

            // Assert
            Assert.IsTrue(isApplicable);
            
        }

        [TestCase(0, 0.66666)]
        [TestCase(0, 0)]
        [TestCase(0, 1)]
        public void UpperBoundTest(double lowerBound, double upperBound)
        {
            // Arrange
            var optionRule = new InvestmentOptionRule()
            {
                From = lowerBound,
                To = upperBound
            };

            // Act
            var isApplicable = optionRule.IsApplicableForProportion(upperBound);

            // Assert
            Assert.IsTrue(isApplicable);

        }

        [TestCase(0, 0, .5)]
        [TestCase(0, 1, -1)]
        [TestCase(0, 1, 1.0001)]
        [TestCase(.1, .3, .31)]
        public void OutOfBoundNotApplicatbleTest(double lowerBound, double upperBound, double proportion)
        {
            // Arrange
            var optionRule = new InvestmentOptionRule()
            {
                From = lowerBound,
                To = upperBound
            };

            // Act
            var isApplicable = optionRule.IsApplicableForProportion(proportion);

            // Assert
            Assert.IsFalse(isApplicable);

        }

    }
}
