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
dotnet run --project ./src/server/\AbcRoiCalculatorApp/AbcRoiCalculatorApp.csproj
```
This will launch the webApp in https://*:5001 and http://*:5000

Visit your browser: https://localhost:5001

#Notes:
- The application can run without the exchange rate service.
- If the exchange rate service is not running the result will be shown in AUD.
- This means that if you want to debug the app, you can run just the AbcRoiCalculatorApp project in debug mode.

## Arquitecture notes:
-- <WIP>
-- 

## Design notes:
-- <WIP>
--
