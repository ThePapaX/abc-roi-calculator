using System;
using System.Collections.Generic;
using System.Security.Cryptography.Xml;

namespace AbcRoiCalculatorApp.Models
{
    public class InvestmentOption : InvestmentOptionBase
    {
        public List<InvestmentOptionRule> Rules { get; set; }

        public InvestmentOption(InvestmentOptionBase investmentOption) : base(investmentOption.Id, investmentOption.Name,  investmentOption.AllocatedProportion)
        {
            // Conditions:
            // - The Rules do not overlap.
            // - There must be at least one Rule.
            // E.G if for any investment for the current option the Roi is 10% and Fee: .5%
            // It implies that there is a single rule with From=0, To=1, Roi=.1, Fee= 0.05


            // new InvestmentOptionRangeComparer()
            Rules = new List<InvestmentOptionRule>();
        }
        public InvestmentOption(int id, string name, double allocatedProportion) : base(id, name, allocatedProportion)
        {
            Rules = new List<InvestmentOptionRule>();
        }
        public InvestmentOption() : base() {
            Rules = new List<InvestmentOptionRule>();
        }

        public void AddRule(InvestmentOptionRule roiRule) => Rules.Add(roiRule);

        public IEnumerable<InvestmentOptionRule> GetRules() => Rules;

        private InvestmentOptionRule GetApplicableRule(double investmentProportion)
        {
            return Rules.Find(rule => rule.IsApplicableForProportion(investmentProportion));

            //foreach (KeyValuePair<double, InvestmentOptionRule> keyValuePair in Rules)
            //{
            //    if (keyValuePair.Value.IsApplicableForProportion(investmentProportion))
            //    {
            //        return keyValuePair.Value;
            //    }
            //}

            //return null;
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