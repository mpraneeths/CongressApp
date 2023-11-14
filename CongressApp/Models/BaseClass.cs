using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CongressApp.Models
{
    public abstract class BaseClass
    {
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
    }
}
