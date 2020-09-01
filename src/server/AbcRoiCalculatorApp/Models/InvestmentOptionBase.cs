using Microsoft.AspNetCore.Mvc.Localization;

using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class InvestmentOptionBase : IEquatable<InvestmentOptionBase>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double AllocatedProportion { get; set; }
        
        public InvestmentOptionBase(int id, string name, double allocatedProportion = 0)
        {
            Id = id;
            Name = name;
            AllocatedProportion = allocatedProportion;
        }
        public InvestmentOptionBase()
        {

        }

        public bool Equals([AllowNull] InvestmentOptionBase other) => this.Id == other?.Id;

        public override bool Equals(object obj)
        {
            return this.Equals(obj as InvestmentOptionBase);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public static bool operator == (InvestmentOptionBase lhs, InvestmentOptionBase rhs) => lhs.Id == rhs.Id;
        public static bool operator !=(InvestmentOptionBase lhs, InvestmentOptionBase rhs) => lhs.Id != rhs.Id;
    }
}
