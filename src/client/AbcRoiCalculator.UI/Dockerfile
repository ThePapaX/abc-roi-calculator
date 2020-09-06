#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

RUN curl -sL https://deb.nodesource.com/setup_current.x |  bash -
RUN apt-get install -y nodejs

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/client/AbcRoiCalculator.UI/AbcRoiCalculator.UI.csproj", "src/client/AbcRoiCalculator.UI/"]
RUN dotnet restore "src/client/AbcRoiCalculator.UI/AbcRoiCalculator.UI.csproj"
COPY . .
WORKDIR "/src/src/client/AbcRoiCalculator.UI"
RUN dotnet build "AbcRoiCalculator.UI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AbcRoiCalculator.UI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AbcRoiCalculator.UI.dll"]
