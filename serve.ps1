$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serveur local démarré sur http://localhost:$port/"
try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") {
            $localPath = "/index.html"
        }
        
        $relativePath = $localPath.TrimStart('/')
        $filePath = Join-Path (Get-Location).Path $relativePath.Replace('/', '\')
        
        if (Test-Path $filePath -PathType Leaf) {
            if ($filePath.EndsWith(".html")) {
                $response.ContentType = "text/html; charset=utf-8"
            }
            elseif ($filePath.EndsWith(".css")) {
                $response.ContentType = "text/css"
            }
            elseif ($filePath.EndsWith(".js")) {
                $response.ContentType = "application/javascript"
            }
            
            $fileStream = [System.IO.File]::OpenRead($filePath)
            $response.ContentLength64 = $fileStream.Length
            $fileStream.CopyTo($response.OutputStream)
            $fileStream.Close()
            $response.StatusCode = 200
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
