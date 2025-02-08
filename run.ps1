<#
.SYNOPSIS
  PowerShell script for automating Docker Compose dev tasks and generating TLS certs on Windows.
  Usage: 
    ./run.ps1 run
    ./run.ps1 stop
    ./run.ps1 clean
    ./run.ps1 generate-certs
#>

param(
    [ValidateSet("run", "stop", "clean", "generate-certs", "help")]
    [string]$Action = "help"
)

# ANSI colors for fancy output
$GREEN = "Green"
$RED   = "Red"

# --------------------------------------------------------------------------
# 1) Establish paths based on the script’s location
# --------------------------------------------------------------------------
$ProjectRoot          = $PSScriptRoot
$DockerComposeDevFile = Join-Path $ProjectRoot "infrastructure\docker\docker-compose.yml"
$NginxDevFile         = Join-Path $ProjectRoot "infrastructure\nginx\nginx.conf"
$TlsDir               = Join-Path $ProjectRoot "infrastructure\tls"
$CertFile             = Join-Path $TlsDir "certificate.crt"
$KeyFile              = Join-Path $TlsDir "private.key"

# --------------------------------------------------------------------------
# 2) Define functions
# --------------------------------------------------------------------------

function Run-Dev {
    Write-Host "Starting development environment..." -ForegroundColor $GREEN
    
    if (!(Test-Path $NginxDevFile)) {
        Write-Host "Error: Nginx config not found at $NginxDevFile" -ForegroundColor $RED
        exit 1
    }

    # Build and run containers in the background
    docker-compose -f $DockerComposeDevFile up --build -d

    # Show container status
    docker-compose -f $DockerComposeDevFile ps

    Write-Host "`nDevelopment environment is running!" -ForegroundColor $GREEN
    Write-Host "Access the app at https://localhost"
}

function Stop-Dev {
    Write-Host "Stopping development environment..." -ForegroundColor $RED
    docker-compose -f $DockerComposeDevFile down
    Write-Host "Development environment stopped." -ForegroundColor $GREEN
}

function Clean-Dev {
    Write-Host "Cleaning up development environment..." -ForegroundColor $RED
    docker-compose -f $DockerComposeDevFile down --volumes --remove-orphans
    docker-compose -f $DockerComposeDevFile rm --stop --force

    docker image rm mern-auth/frontend:latest mern-auth/backend:latest 2>$null | Out-Null

    Write-Host "Development environment cleaned." -ForegroundColor $GREEN
}

function Generate-Certs {
    Write-Host "Generating self-signed TLS certificates..." -ForegroundColor $GREEN

    if (!(Test-Path $TlsDir)) {
        New-Item -ItemType Directory -Path $TlsDir | Out-Null
    }

    $cmd = "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout `"$KeyFile`" -out `"$CertFile`" -subj `"/CN=localhost`""
    
    Write-Host "Running: $cmd"
    Invoke-Expression $cmd 

    Write-Host "`nCertificate generated:" -ForegroundColor $GREEN
    Write-Host "  Certificate: $CertFile"
    Write-Host "  Key:         $KeyFile"
}

function Show-Usage {
    Write-Host "Usage:" -ForegroundColor $GREEN
    Write-Host "  ./run.ps1 run            - Build & start the dev environment"
    Write-Host "  ./run.ps1 stop           - Stop all containers in the dev environment"
    Write-Host "  ./run.ps1 clean          - Stop & remove containers, volumes, and images"
    Write-Host "  ./run.ps1 generate-certs - Generate a self-signed TLS certificate in infrastructure/tls/"
    Write-Host "  ./run.ps1 help           - Show this usage"
}

# --------------------------------------------------------------------------
# 3) Switch on the $Action parameter
# --------------------------------------------------------------------------
switch ($Action.ToLower()) {
    "run"            { Run-Dev }
    "stop"           { Stop-Dev }
    "clean"          { Clean-Dev }
    "generate-certs" { Generate-Certs }
    default          { Show-Usage }
}
