#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["RiftARENA/RiftARENA.csproj", "RiftARENA/"]
RUN dotnet restore "./RiftARENA/./RiftARENA.csproj"
COPY . .
WORKDIR "/src/RiftARENA"
RUN dotnet build "./RiftARENA.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./RiftARENA.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

RUN dotnet tool install --global dotnet-ef --version 7.0.0
ENV PATH="$PATH:/root/.dotnet/tools"
RUN dotnet ef database update

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RiftARENA.dll"]