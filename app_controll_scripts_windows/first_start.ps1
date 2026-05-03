# starts the first docker environment:
#   db on port 5432
#   app instance on port provided by an argument

param (
    # Default to 3000 if not provided
    [Parameter(Mandatory = $false, HelpMessage = "Enter a port number between 1024 and 65535")]
    [ValidateRange(1024, 65535)]
    [int]$APP_PORT = 3000   
)

# Check if the port is already being used on your machine
$port_check = Get-NetTCPConnection -LocalPort $APP_PORT -ErrorAction SilentlyContinue

if ($port_check) {
    Write-Error "Port $APP_PORT is already in use by another process! Please choose a different port."
    exit
}

# log info
Write-Host "Preparing to launch simplified_stock_market on port $APP_PORT..." -ForegroundColor cyan

# Set the environment variable for the current PowerShell session
$env:APP_PORT = $APP_PORT

# make sure we are in the app root dir, otherwise the script will implode
$parent_dir = Split-Path -Parent $PSScriptRoot
Set-Location -Path $parent_dir

# read the instance_count file
$instance_count_file_path = Join-Path -Path $PSScriptRoot -ChildPath "instance_count"

# validate the contents
if (Test-Path $instance_count_file_path) {
    $file_item = Get-Item $instance_count_file_path
    
    # check if the file is empty (size is 0 bytes)
    if ($file_item.Length -eq 0) {
        Write-Host "The file is empty." -ForegroundColor Yellow
        # override the file with 1 - current instance is first
        Set-Content -Path $instance_count_file_path -Value ([int]1)
    }
    else {
        # read content and trim whitespace
        $raw_content = (Get-Content $instance_count_file_path -Raw).Trim()

        # check if it contains a number
        if ($raw_content -match '^\d+$') {
            $count = [int]$raw_content
            Write-Host "File contains valid number: $count" -ForegroundColor Green

            # check if number is 0
            if ($count -ne 0) {
                # we can not run the script, there are alive instances,
                # either a mistake or first_start.ps1 was run
                Write-Error "The instance_count file suggests that some instances are alive, if this is the case we DO NOT run another first_start.ps1, if this is a mistake try running the cleanup.ps1"
                Write-Host  "--------------------------------" -ForegroundColor green
                Write-Host "Try running the cleanup.ps1 first" -ForegroundColor green
                Write-Host  "--------------------------------" -ForegroundColor green
                exit 0
            }
            else {
                # all is good 
                Set-Content -Path $instance_count_file_path -Value ([int]1)
            }

        }
        else {
            Write-Host "File is not empty, but does not contain a valid number." -ForegroundColor Red
            Write-Host "Assume this is the first instance." -ForegroundColor Red
            # override the file with 1 - current instance is first
            Set-Content -Path $instance_count_file_path -Value ([int]1)
        }
    }
}
else {
    Write-Host "File does not exist." -ForegroundColor Red

    # create the file and fill it with 1 - current instance is first
    Set-Content -Path $instance_count_file_path -Value ([int]1)
}

# log the current dir
Write-Host "Script starting from directory: " -NoNewline -ForegroundColor Cyan
Write-Host (Get-Location).Path -ForegroundColor White

# prep name for container
$docker_container_name = "simplified_stock_market_$($count)"

# Run docker-compose
docker-compose -p $docker_container_name up -d --build