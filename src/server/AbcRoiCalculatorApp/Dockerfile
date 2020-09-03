#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/server/AbcRoiCalculatorApp/AbcRoiCalculatorApp.csproj", "src/server/AbcRoiCalculatorApp/"]
COPY ["src/server/ExchangeRateServiceClient/ExchangeRateServiceClient.csproj", "src/server/ExchangeRateServiceClient/"]
RUN dotnet restore "src/server/AbcRoiCalculatorApp/AbcRoiCalculatorApp.csproj"
COPY . .
WORKDIR "/src/src/server/AbcRoiCalculatorApp"
RUN dotnet build "AbcRoiCalculatorApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AbcRoiCalculatorApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AbcRoiCalculatorApp.dll"]