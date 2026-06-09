Add-Type @"
using System;
using System.Net;
using System.IO;

public class SimpleHttpServer {
    public static void Start() {
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://127.0.0.1:8080/");
        listener.Start();
        Console.WriteLine("Listening on http://127.0.0.1:8080/...");
        try {
            while (true) {
                HttpListenerContext ctx = listener.GetContext();
                HttpListenerRequest req = ctx.Request;
                HttpListenerResponse res = ctx.Response;
                
                try {
                    string path = req.Url.LocalPath;
                    if (path == "/") path = "/index.html";
                    string file = "." + path.Replace('/', '\\');
                    
                    if (File.Exists(file)) {
                        byte[] bytes = File.ReadAllBytes(file);
                        res.StatusCode = 200;
                        if (file.EndsWith(".html")) res.ContentType = "text/html; charset=utf-8";
                        res.ContentLength64 = bytes.Length;
                        
                        if (req.HttpMethod != "HEAD") {
                            res.OutputStream.Write(bytes, 0, bytes.Length);
                        }
                    } else {
                        res.StatusCode = 404;
                    }
                } catch (Exception ex) {
                    Console.WriteLine("Error serving " + req.Url.LocalPath + ": " + ex.Message);
                    res.StatusCode = 500;
                }
                
                try { res.Close(); } catch {}
            }
        } finally {
            listener.Stop();
        }
    }
}
"@

Set-Location -Path "c:\Users\Ziyad\Desktop\teste"
[SimpleHttpServer]::Start()
