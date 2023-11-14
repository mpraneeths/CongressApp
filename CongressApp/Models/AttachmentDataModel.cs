using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CongressApp.Models
{
    public class AttachmentDataModel
    {
        public byte[] GetFileMS(string path)
        {
            return File.ReadAllBytes(path);
        }
        public bool IsFileExists(string path)
        {
            return File.Exists(path);
        }
    }
}
