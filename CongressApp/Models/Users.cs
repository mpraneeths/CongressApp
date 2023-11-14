using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CongressApp.Models
{
    public class Users : BaseClass
    {
        public ObjectId _id { get; set; }
        public string UserName {get; set;}
        public string Password {get; set;}
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Role { get; set; }
        public string MembershipId { get; set; }
        public string MobileNumber { get; set; }
        public string EmailId { get; set; }
        public string TwitterId { get; set; }
        public string FacebookId { get; set; }
    }
}
