using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CongressApp.Models
{
    public class Items : BaseClass
    {
        public ObjectId _id { get; set; }
        public string ItemDate { get; set; }
        public List<Item> CreatedItems { get; set; }
    }
    public class Item
    {
        public int Index { get; set; }
        public string Name { get; set; }
    }
}
