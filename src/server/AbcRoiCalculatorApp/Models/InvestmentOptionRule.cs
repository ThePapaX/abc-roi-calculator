using System;
using System.Collections.Generic;
using System.Security.Cryptography.Xml;

namespace AbcRoiCalculatorApp.Models
{
    public class InvestmentOptionRule : InvestmentOption
    {
        public SortedList<double, InvestmentOptionRange> RangeRules { get; set; }

        public InvestmentOptionRule(InvestmentOption investmentOption) : base(investmentOption.Id, investmentOption.Name,  investmentOption.AllocatedProportion)
        {
            // Conditions:
            // - The Rules do not overlap.
            // - There must be at least one Rule.
            // E.G if for any investment for the current option the Roi is 10% and Fee: .5%
            // It implies that there is a single rule with From=0, To=1, Roi=.1, Fee= 0.05

            // TODO: Maybe we can use a single LIST and sort if after initialization ? to make it simpler.
            RangeRules = new SortedList<double, InvestmentOptionRange>(new InvestmentOptionRangeComparer());
        }
        public InvestmentOptionRule(int id, string name, double allocatedProportion) : base(id, name, allocatedProportion)
        {
            RangeRules = new SortedList<double, InvestmentOptionRange>(new InvestmentOptionRangeComparer());
        }

        public void AddRule(InvestmentOptionRange roiRule) => RangeRules.Add(roiRule.To, roiRule);

        public IEnumerable<InvestmentOptionRange> GetRules() => RangeRules.Values;

        private InvestmentOptionRange GetApplicableRule(double investmentProportion)
        {
            foreach (KeyValuePair<double, InvestmentOptionRange> keyValuePair in RangeRules)
            {
                if (keyValuePair.Value.IsApplicableForProportion(investmentProportion))
                {
                    return keyValuePair.Value;
                }
            }

            return null;
        }

        public RoiResult CalculateRoiForAmount(double investmentAmount)
        {
            if (AllocatedProportion < 0 || AllocatedProportion > 1)
            {
                throw new InvalidOperationException();
            }

            var roi = new RoiResult();
            var applicableRule = GetApplicableRule(AllocatedProportion);

            if (applicableRule == null)
            {
                throw new Exception($"CONFIGURATION_ERROR: Could not find a valid rule for this option. Option: ${this.Id} ${this.Name}");
            }

            roi.Value = applicableRule.Roi * investmentAmount;
            roi.Fee = applicableRule.Fee * roi.Value; //the fee is applied to the ROI result as per requirements.

            return roi;
        }
    }
}