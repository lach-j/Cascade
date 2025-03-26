# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# install nodejs
ENV NODE_VERSION=22.11.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# Set the working directory
WORKDIR /app

# Copy the project file and restore dependencies
COPY ../Cascade.Example/Cascade.Example.csproj ./Cascade.Example/Cascade.Example.csproj
COPY ../Cascade.EntityFramework.SqlServer/Cascade.EntityFramework.SqlServer.csproj ./Cascade.EntityFramework.SqlServer/
COPY ../Cascade.EntityFramework/Cascade.EntityFramework.csproj ./Cascade.EntityFramework/
COPY ../Cascade.Core/Cascade.Core.csproj ./Cascade.Core/

RUN dotnet restore ./Cascade.Example/Cascade.Example.csproj

# Copy the rest of the application code
COPY . ./

# Build the application
RUN dotnet publish -c Release -o out

# Use the official .NET runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set the working directory
WORKDIR /app

# Copy the built application from the build image
COPY --from=build /app/out .

# Expose the port the application runs on
EXPOSE 80

# Set the entry point for the application
ENTRYPOINT ["dotnet", "Cascade.Example.dll"]