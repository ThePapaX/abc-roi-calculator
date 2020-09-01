using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class InvestmentOptionRules 
    {
        public virtual InvestmentOption InvestmentOption { get; set; }
        public SortedList<double, RoiTierRule> Rules { get; set; }
        public InvestmentOptionRules(InvestmentOption investmentOption)
        {

            InvestmentOption = investmentOption;
            // Conditions:
            // - The Rules do not overlap.
            // - There must be at least one Rule. 
            // E.G if for any investment for the current option the Roi is 10% and Fee: .5%
            // It implies that there is a single rule with From=0, To=1, Roi=.1, Fee= 0.05

            // TODO: Maybe we can use a single LIST and sort if after initialization ? to make it simpler.
            Rules = new SortedList<double, RoiTierRule>(new RoiTierComparer());
            
        }
   

        public void AddRule(RoiTierRule roiRule) => Rules.Add(roiRule.To, roiRule);
    public IEnumerable<RoiTierRule> GetRules() => Rules.Values;

    private RoiTierRule GetApplicableRule(double investmentProportion)
    {
        foreach (KeyValuePair<double, RoiTierRule> keyValuePair in Rules)
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
        if (InvestmentOption.AllocatedProportion < 0 || InvestmentOption.AllocatedProportion > 1)
        {
            throw new InvalidOperationException();
        }

        var roi = new RoiResult();
        var applicableRule = GetApplicableRule(InvestmentOption.AllocatedProportion);

        if (applicableRule != null)
        {
            roi.Value = applicableRule.Roi * investmentAmount;
            roi.Fee = applicableRule.Fee * investmentAmount;
        }

        return roi;
    }

}
}
