## Solution file structure

```
AbcRoiCalculator.sln
src/
  client/
    ReactApp
  server/
    AbcRoiCalculatorApp
    AbcRoiCalculator.Test
    ExchangeRatesService
    ExchangeRateServiceClient
```  

## Instructions
* Clone repository: 
```sh
git clone https://github.com/ThePapaX/abc-roi-calculator.git
```
* Change working directory to the freshly cloned:
```sh
cd ./abc-roi-calculator
```
* Run the ExchangeRateService project:
```sh
dotnet run --project ./src/server/ExchangeRatesService/ExchangeRatesService.csproj
```
This will launch the Exchange Rate GRPC service in port https://:50051 by default.

* Run the AbcRoiCalculator.API projeect:
```sh
dotnet run --project ./src/server/AbcRoiCalculatorApp/AbcRoiCalculatorApp.csproj
```
This will launch the webApp in https://*:5001 and http://*:5000

Visit your browser: https://localhost:5001

## Configuration:
* All the business rules are configured in the AbcRoiCalculatorApp project. appsettings.json
```json
{
  "RoiConfiguration": {
    "BaseCurrency": "AUD",
    "TargetCurrency": "USD",
    "BaseFee": 250,
    "InvestmentBusinessRules": [
      {
        "Id": 1,
        "Name": "Cash investments",
        "Rules": [
          {
            "From": 0,
            "To": 0.5,
            "Roi": 0.085,
            "Fee": 0.005
          },
          {
            "From": 0.5,
            "To": 1,
            "Roi": 0.1,
            "Fee": 0
          }
        ]
      }, 
      ....
    ]
  }
}
```
* On load the client will send an API request to /api/roi to read these settings and business investments options available.

#Notes:
- The application can run without the exchange rate service.
- If the exchange rate service is not running the result will be shown in AUD.
- This means that if you want to debug the app, you can run just the AbcRoiCalculatorApp project in debug mode.

## Arquitecture notes:
- We took a microservice aproach. The original intention is to run each project component as a containerized application (There is no docker compose file though as of writing this documentation, but will be provided). 
- The UI can be served directly behind a webServer (nginx, iisexpress, kestrel), and the api can be proxied. But,
- The AbcRoiCalculatorApp, was originally intended to be just a API project AbcRoiCalculator.API, but for simplicity purposes I've added the SPA services to serve the UI as well.
- GRPC is used for services communication, and we use protobuffers as message exchange format.
- The exchange service is loosely coupled with the app, and the app can function without any exchange rate service provider. The currency of the calculation is always returned in the result response.

## Design notes:
- <WIP>
-
