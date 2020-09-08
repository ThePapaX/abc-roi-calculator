using AbcRoiCalculatorApp.Models;
using ExchangeRateServiceClient;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AbcRoiCalculatorApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddNewtonsoftJson();

            // We only need one instance for the business rules.
            services.AddSingleton<IBusinessRules>(br =>
            {
                var config = new RoiBusinessRules();
                // We are using the Options Pattern (https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-3.1)
                Configuration.GetSection(RoiBusinessRules.RoiConfiguration).Bind(config);

                return config;
            });

            services.AddSingleton<IExchangeRatesProvider, ExchangeRateServiceClient.ExchangeRateServiceClient>();

            services.AddScoped<ICurrencyConverter, CurrencyConverter>();
            services.AddScoped<IRoiCalculator, RoiCalculator>();

            // In production, the React files will be served from this directory
            //services.AddSpaStaticFiles(configuration =>
            //{
            //    configuration.RootPath = "ReactApp/build";
            //});
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors(builder =>
            {
                builder.WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowCredentials();
            });

            app.UseHttpsRedirection();
            //app.UseStaticFiles();
            //app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            //TODO: decouple the React application in a separate process.
            //app.UseSpa(spa =>
            //{
            //    spa.Options.SourcePath = "..\\..\\client\\ReactApp";

            //    if (env.IsDevelopment())
            //    {
            //        spa.UseReactDevelopmentServer(npmScript: "start");
            //    }
            //});
        }
    }
}