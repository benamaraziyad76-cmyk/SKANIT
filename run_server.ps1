$port = 5000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serveur en ecoute sur http://127.0.0.1:$port/ et http://localhost:$port/"
try {
    while ($true) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path (Get-Location).Path $localPath.TrimStart('/').Replace('/', '\')
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.StatusCode = 200
            $response.SendChunked = $true
            if ($filePath.EndsWith(".html")) {
                $response.ContentType = "text/html"
            }
            elseif ($filePath.EndsWith(".css")) {
                $response.ContentType = "text/css"
            }
            elseif ($filePath.EndsWith(".js")) {
                $response.ContentType = "application/javascript"
            }
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
}
finally {
    $listener.Stop()
}
