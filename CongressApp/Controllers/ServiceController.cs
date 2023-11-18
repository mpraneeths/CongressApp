using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using CongressApp.Models;
using MongoDB.Bson;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Web;
using System.Security.AccessControl;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;

namespace CongressApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ServiceController(IConfiguration configuration)
        {
            this._configuration = configuration;
        }
        private IMongoDatabase DatabaseProvider()
        {
            var client = new MongoClient(this._configuration.GetConnectionString("DefaultConnection"));
            return client.GetDatabase("Congress");
        }

        [HttpPost("login")]
        public Token Login([FromBody] LoginModel loginModel)
        {
            Token token = new Token();
            IMongoDatabase dataBase = DatabaseProvider();
            var collection = dataBase.GetCollection<Users>("User");
            var filter = Builders<Users>.Filter.Eq("UserName", loginModel.UserName.ToLower()) & Builders<Users>.Filter.Eq("Password", loginModel.Password);
            var userDocument = collection.Find(filter).FirstOrDefault();
            if (userDocument != null)
            {
                var storedPassword = userDocument.Password;
                var signingKey = Convert.FromBase64String("minimumSixteenCharacters");
                var expiryDuration = 1440;
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Issuer = "https://localhost:4348",
                    Audience = "https://localhost:4348",
                    IssuedAt = DateTime.UtcNow,
                    NotBefore = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(expiryDuration),
                    Subject =
                        new ClaimsIdentity(new List<Claim>
                        {
                        new Claim("userName", loginModel.UserName),
                        }),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey), SecurityAlgorithms.HmacSha256Signature)
                };
                JwtSecurityTokenHandler jwtTokenHandler = new JwtSecurityTokenHandler();
                JwtSecurityToken jwtToken = jwtTokenHandler.CreateJwtSecurityToken(tokenDescriptor);
                token.TokenValue = jwtTokenHandler.WriteToken(jwtToken);
            }
            else
            {
                token.Error = "User Not Found";
            }
            return token;
        }
        [Authorize]
        [HttpPost("createitems")]
        public bool UpdateItems([FromBody] Items items)
        {
            var database = DatabaseProvider();
            var collection = database.GetCollection<Items>("Items");
            var filter = Builders<Items>.Filter.Eq("ItemDate", items.ItemDate);
            var isUpdate = collection.Find(filter).FirstOrDefault();
            if (isUpdate != null)
            {
                Item newItem = new Item { Index = isUpdate.CreatedItems.Count + 1, Name = items.CreatedItems.FirstOrDefault().Name };
                isUpdate.CreatedItems.Add(newItem);
                var update = Builders<Items>.Update.Set("ItemDate", items.ItemDate).Set("CreatedItems", isUpdate.CreatedItems);
                collection.UpdateOne(filter, update);
                return true;
            }
            else
            {
                collection.InsertOne(items);
                return true;
            }
        }
        [Authorize]
        [HttpGet("getitems")]
        public Items GetItems([FromQuery] string date)
        {
            var database = DatabaseProvider();
            var collection = database.GetCollection<Items>("Items");
            var filter = Builders<Items>.Filter.Eq("ItemDate", date);
            var itemsToSend = collection.Find(filter).FirstOrDefault();
            return itemsToSend;
        }
        [Authorize]
        [HttpGet("getdata")]
        public List<AttachmentData> GetAttachmentData([FromQuery] string selectedDate)
        {
            var database = DatabaseProvider();
            var collection = database.GetCollection<AttachmentData>("AttachmentData");
            var filters = collection.Find(Builders<AttachmentData>.Filter.Eq("SelectedDateTime", selectedDate) & Builders<AttachmentData>.Filter.Eq("IsDeleted", false)).ToList();
            return filters;
        }
        [Authorize]
        [HttpPost("addData")]
        public bool StoreAttachmentData(IList<IFormFile> file)
        {
            var stream = new MemoryStream();
            AttachmentDataModel adm = new AttachmentDataModel();
            file.FirstOrDefault().CopyTo(stream);
            string workingDirectoryPath = Directory.GetCurrentDirectory();
            AttachmentData attachmentData = JsonConvert.DeserializeObject<AttachmentData>(HttpUtility.UrlDecode(file.FirstOrDefault().FileName));
            string newFileName = attachmentData.Filename;
            string fileExt = Path.GetExtension(newFileName);
            string dirName = Path.Combine(workingDirectoryPath, "SavedFiles");
            if (!Directory.Exists(dirName))
            {
                DirectorySecurity directorySecurity = new DirectorySecurity();
                FileSystemAccessRule fileSystemAccessRule = new FileSystemAccessRule("everyone",
                    FileSystemRights.FullControl, AccessControlType.Allow);
                directorySecurity.AddAccessRule(fileSystemAccessRule);
                Directory.CreateDirectory(dirName);
            }
            using (FileStream fileStream = new FileStream(Path.Combine(workingDirectoryPath, "SavedFiles", DateTime.Now.ToString("yyyyMMddHHmmss") + fileExt), FileMode.Create))
            {
                // Copy the IFormFile to the FileStream object.
                file.FirstOrDefault().CopyTo(fileStream);
            }
            var attachment = new AttachmentData
            {
                TimeSelected = attachmentData.TimeSelected,
                ColumnName = attachmentData.ColumnName,
                SelectedDateTime = attachmentData.SelectedDateTime,
                SelectedItem = attachmentData.SelectedItem,
                Filename = attachmentData.Filename,
                IsLink = false,
                FilePath = Path.Combine(workingDirectoryPath, "SavedFiles", DateTime.Now.ToString("yyyyMMddHHmmss") + fileExt),
                CreatedBy = attachmentData.CreatedBy,
                CreatedDate = attachmentData.CreatedDate,
                IsDeleted = false
            };
            var database = DatabaseProvider();
            var collection = database.GetCollection<AttachmentData>("AttachmentData");
            collection.InsertOne(attachment);
            return true;
        }

        [Authorize]
        [HttpPost("addDataAsLink")]
        public bool StoreLinkData([FromBody] AttachmentData input)
        {
            input.IsDeleted = false;
            input.IsLink = true;
            var database = DatabaseProvider();
            var collection = database.GetCollection<AttachmentData>("AttachmentData");
            collection.InsertOne(input);
            return true;
        }

        [Authorize]
        [HttpGet("downloadFile")]
        public IActionResult DownloadFile([FromQuery] string filePath)
        {
            AttachmentDataModel adm = new AttachmentDataModel();
            byte[] fileContents = adm.GetFileMS(filePath);
            FileContentResult fileContentResult = new FileContentResult(fileContents, "application/octet-stream");
            fileContentResult.FileDownloadName = Path.GetFileName(filePath);
            return fileContentResult;
        }
        [Authorize]
        [HttpPost("addUser")]
        public bool AddUser([FromBody] UserModel userModel)
        {
            var database = DatabaseProvider();
            var collection = database.GetCollection<Users>("User");
            Users user = new Users
            {
                UserName = userModel.User.ToLower(),
                Password = "FirstPass@!123",
                Surname = userModel.Surname,
                EmailId = userModel.EmailId,
                FacebookId = userModel.Facebook,
                MembershipId = userModel.MemberId,
                MobileNumber = userModel.Mobile,
                Name = userModel.Name,
                Role = userModel.Role,
                TwitterId = userModel.Twitter,
                CreatedBy = userModel.CreatedBy,
                CreatedDate = userModel.CreatedDate
            };
            collection.InsertOne(user);
            return true;
        }
        [HttpPut("updatePassword")]
        public bool UpdatePassword([FromBody] LoginModel loginModel)
        {
            var database = DatabaseProvider();
            var collection = database.GetCollection<Users>("User");
            var filter = Builders<Users>.Filter.Eq("UserName", loginModel.UserName.ToLower());
            var isUpdate = collection.Find(filter).FirstOrDefault();
            var update = Builders<Users>.Update.Set("UserName", isUpdate.UserName.ToLower())
                .Set("Password", loginModel.Password)
                .Set("Name", isUpdate.Name)
                .Set("Surname", isUpdate.Surname)
                .Set("Role", isUpdate.Role)
                .Set("MembershipId", isUpdate.MembershipId)
                .Set("MobileNumber", isUpdate.MobileNumber)
                .Set("EmailId", isUpdate.EmailId)
                .Set("TwitterId", isUpdate.TwitterId)
                .Set("FacebookId", isUpdate.FacebookId);
            collection.UpdateOne(filter, update);
            return true;
        }
        [Authorize]
        [HttpGet("usersget")]
        public List<Users> GetAllUsers()
        {
            var database = DatabaseProvider();
            var collection = database.GetCollection<Users>("User");
            var users = collection.Find(Builders<Users>.Filter.Empty).ToList();
            foreach (var user in users)
            {
                user.Password = null;
            }
            return users;
        }
        [Authorize]
        [HttpGet("getUserattachements")]
        public List<AttachmentData> getUserDocs([FromQuery] string selectedDate, [FromQuery] string itemName)
        {
            var database = DatabaseProvider();
            var collection = database.GetCollection<AttachmentData>("AttachmentData");
            var filterQuery = Builders<AttachmentData>.Filter.Eq("SelectedDateTime", selectedDate) & Builders<AttachmentData>.Filter.Eq("SelectedItem", itemName) & Builders<AttachmentData>.Filter.Eq("IsDeleted", false);
            var filters = collection.Find(filterQuery).ToList().OrderBy(x => x.CreatedDate).ToList();
            return filters;
        }
        [Authorize]
        [HttpGet("getAllUserattachements")]
        public List<AttachmentData> getAllUserDocs([FromQuery] string user)
        {
            if (string.IsNullOrEmpty(user))
            {
                throw new Exception("User cannot be empty");
            }
            var database = DatabaseProvider();
            var collection = database.GetCollection<AttachmentData>("AttachmentData");
            var filterQuery = Builders<AttachmentData>.Filter.Eq("CreatedBy", user) & Builders<AttachmentData>.Filter.Eq("IsDeleted", false);
            var filters = collection.Find(filterQuery).ToList().OrderBy(x => x.CreatedDate).ToList();
            return filters;
        }
        [Authorize]
        [HttpDelete("deleteattachment")]
        public bool DeleteDocument([FromQuery]string id)
        {
            var identifier = JsonConvert.DeserializeObject<MongoObj>(id);
            ObjectId tempId = new ObjectId(identifier.Timestamp, identifier.Machine, identifier.Pid, identifier.Increment);
            var database = DatabaseProvider();
            var collection = database.GetCollection<AttachmentData>("AttachmentData");
            var filter = Builders<AttachmentData>.Filter.Eq("_id", tempId);
            var isUpdate = collection.Find(filter).FirstOrDefault();
            collection.UpdateOne(filter, Builders<AttachmentData>.Update.Set(x => x.Filename, isUpdate.Filename)
                .Set(x => x.FilePath, isUpdate.FilePath)
                .Set(x => x.IsDeleted, true)
                .Set(x => x.SelectedDateTime, isUpdate.SelectedDateTime)
                .Set(x=>x.SelectedItem, isUpdate.SelectedItem)
                .Set(x=>x.TimeSelected, isUpdate.TimeSelected)
                .Set(x=>x.ColumnName, isUpdate.ColumnName)
                .Set(x=>x.CreatedBy, isUpdate.CreatedBy)
                .Set(x=>x.CreatedDate, isUpdate.CreatedDate)
                );
            return true;
        }
    }
}
