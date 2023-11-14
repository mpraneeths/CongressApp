using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CongressApp.Middleware
{
    public class CustomMiddlewareToAddFields : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                var todayDate = DateTime.Now.ToString("yyyyMMdd");
                string workingDirectoryPath = Directory.GetCurrentDirectory();
                string directoryPath = Path.Combine(workingDirectoryPath, "ErrorLogs");
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }
                var filePath = Path.Combine(directoryPath, $"{todayDate}.txt");
                if (!File.Exists(filePath))
                {
                    File.Create(filePath).Dispose();
                }
                using(StreamWriter writer = File.AppendText(filePath))
                {
                    writer.WriteLine(JsonConvert.SerializeObject(context.Request));
                    writer.WriteLine(JsonConvert.SerializeObject(ex));
                }
                throw ex;
            }
        }
    }
}
