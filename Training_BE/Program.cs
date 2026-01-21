using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Training_BE.Data;
using Training_BE.Middleware;
using Training_BE.Services;



namespace Training_BE
{
    public class Program
    {
        public static void Main(string[] args)
        {

            


            var builder = WebApplication.CreateBuilder(args);

            //  Configure Serilog
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File(
                    "logs/log-.txt",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss}] [{Level:u3}] {Message:lj}{NewLine}{Exception}"
                )
                .CreateLogger();

            // Use Serilog instead of default logger
            builder.Host.UseSerilog();


            // 1. Add CORS service
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    policy => policy
                        //.WithOrigins("http://localhost:3000") // only my frontend will acccess
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });



            // Add services to the container
            builder.Services.AddControllers();

            // Swagger with JWT support
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen();



            // Register DbContext with SQL Server
            //builder.Services.AddDbContext<ApplicationDbContext>(options =>
            //    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


            // Register services for dependency injection
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<ProductService>();
            builder.Services.AddScoped<AddressService>();
            builder.Services.AddScoped<WishlistService>();
            builder.Services.AddScoped<CartService>();
            builder.Services.AddScoped<DeliveryPartnerAuthService>();
            builder.Services.AddScoped<DeliveryPartnerOrderService>();



            // JWT Authentication
            //builder.Services.AddAuthentication(options =>
            //{
            //    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //})
            //.AddJwtBearer(options =>
            //{
            //    options.TokenValidationParameters = new TokenValidationParameters
            //    {
            //        ValidateIssuer = true,
            //        ValidateAudience = true,
            //        ValidateLifetime = true,
            //        ValidateIssuerSigningKey = true,
            //        ValidIssuer = builder.Configuration["Jwt:Issuer"],
            //        ValidAudience = builder.Configuration["Jwt:Audience"],
            //        IssuerSigningKey = new SymmetricSecurityKey(
            //            Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]))
            //    };
            //});

            // new Jwt Authentication with error handling
            var jwtSection = builder.Configuration.GetSection("Jwt");

            var jwtKey = jwtSection["Key"]
                ?? throw new Exception("JWT Key is missing");
            var jwtIssuer = jwtSection["Issuer"]
                ?? throw new Exception("JWT Issuer is missing");
            var jwtAudience = jwtSection["Audience"]
                ?? throw new Exception("JWT Audience is missing");

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.ASCII.GetBytes(jwtKey))
                };
            });


            builder.Services.AddAuthorization();

            Log.Information("Starting The Application");
            

            builder.WebHost.ConfigureKestrel(options =>
            {
                var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
                options.ListenAnyIP(int.Parse(port));
            });


            var app = builder.Build();

            // Global Exception Handling Middleware
            app.UseMiddleware<ExceptionMiddleware>();

            
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ecommerce API v1");
                    c.RoutePrefix = "swagger";
                });
            

            app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();

           


            
        }
    }
}


