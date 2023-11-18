using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CongressApp.Models
{
    public class AttachmentData : BaseClass
    {
        public ObjectId _id { get; set; }
        public string SelectedDateTime { get; set; }
        public string TimeSelected { get; set; }
        public string SelectedItem { get; set; }
        public string ColumnName { get; set; }
        public bool IsLink { get; set; }
        public string Filename { get; set; }
        public string FilePath { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class MongoObj
    {
        //
        // Summary:
        //     Gets the PID.
        [Obsolete("This property will be removed in a later release.")]
        public short Pid { get; set; }
        //
        // Summary:
        //     Gets the machine.
        [Obsolete("This property will be removed in a later release.")]
        public int Machine { get; set; }
        //
        // Summary:
        //     Gets the timestamp.
        public int Timestamp { get; set; }
        //
        // Summary:
        //     Gets the increment.
        [Obsolete("This property will be removed in a later release.")]
        public int Increment { get; set; }
        //
        // Summary:
        //     Gets the creation time (derived from the timestamp).
        public DateTime CreationTime { get; set; }
    }
}
