Write-Host "Setting up Elvara & Co. Database..." -ForegroundColor Cyan

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js first."
    exit
}

# Navigate to Backend
Set-Location "$PSScriptRoot\Backend"

# Install dependencies if node_modules works
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Create Database
Write-Host "Creating database..." -ForegroundColor Yellow
node create_db.js
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create database."
    exit
}

# Seed Database
Write-Host "Seeding database..." -ForegroundColor Yellow
node seed.js
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to seed database."
    exit
}

Write-Host "Database setup complete! You can now start the server with 'npm start' in the Backend directory." -ForegroundColor Green
