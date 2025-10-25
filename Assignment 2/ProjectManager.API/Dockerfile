FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ProjectManager.API.csproj", "."]
RUN dotnet restore "./ProjectManager.API.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "ProjectManager.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ProjectManager.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjectManager.API.dll"]