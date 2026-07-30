$ErrorActionPreference = "Stop"

$baseUrl = if ($env:API_BASE_URL) { $env:API_BASE_URL } else { "http://localhost:8080" }
$cookieJar = Join-Path $PSScriptRoot "..\cookies.txt"

# Use curl.exe because PowerShell's curl alias invokes Invoke-WebRequest.
curl.exe -i "$baseUrl/api/v1/users/me" `
    -b $cookieJar

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
