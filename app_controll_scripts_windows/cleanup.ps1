# make sure we are in the app root dir, otherwise the script will implode
$parentDir = Split-Path -Parent $PSScriptRoot
Set-Location -Path $parentDir

# read the instance_count file
$instance_count_file_path = Join-Path -Path $PSScriptRoot -ChildPath "instance_count"

# override the file with 0
Set-Content -Path $instance_count_file_path -Value ([int]0)

# clean all docker containers
$containerIds = docker ps -aq

# Only try to remove if there are actually containers to remove
if ($containerIds) {
    Write-Host "Cleaning up containers..." -ForegroundColor Cyan
    docker rm -f $containerIds
} else {
    Write-Host "No containers found to clean up." -ForegroundColor Gray
}