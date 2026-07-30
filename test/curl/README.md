# Curl Checks

These manual curl checks use a shared cookie jar at `test/curl/cookies.txt`.
Run the login script before the authenticated `get-me` script.

The scripts default to `http://localhost:8080`. Set `API_BASE_URL` to use a
different API address, such as `http://localhost:3000`.

Unix-like shells:

```bash
./test/curl/unix/login.sh
./test/curl/unix/get-me.sh
```

PowerShell on Windows:

```powershell
.\test\curl\windows\login.ps1
.\test\curl\windows\get-me.ps1
```

The PowerShell scripts deliberately call `curl.exe`, not `curl`, because
PowerShell can alias `curl` to `Invoke-WebRequest`.
