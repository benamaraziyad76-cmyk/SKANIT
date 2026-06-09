Add-Type -AssemblyName System.Drawing

$SRC = Join-Path $PSScriptRoot "PHOTOS_NOUVELLES"
$DEST = Join-Path $PSScriptRoot "public\menu-images"
if (!(Test-Path $DEST)) { New-Item -ItemType Directory -Path $DEST -Force | Out-Null }

function Crop-HD {
    param([string]$SrcPath, [string]$Name, [double]$L, [double]$T, [double]$W, [double]$H)
    if (!(Test-Path $SrcPath)) { return }
    try {
        $bytes = [System.IO.File]::ReadAllBytes($SrcPath)
        $ms = New-Object System.IO.MemoryStream($bytes, $false)
        $img = [System.Drawing.Image]::FromStream($ms)
        $iw = $img.Width; $ih = $img.Height
        $cx = [int]($L * $iw); $cy = [int]($T * $ih)
        $cw = [int]($W * $iw); $ch = [int]($H * $ih)
        if ($cx + $cw -gt $iw) { $cw = $iw - $cx }
        if ($cy + $ch -gt $ih) { $ch = $ih - $cy }

        $cropped = New-Object System.Drawing.Bitmap($cw, $ch)
        $g = [System.Drawing.Graphics]::FromImage($cropped)
        $g.InterpolationMode = 'HighQualityBicubic'
        $g.SmoothingMode = 'HighQuality'
        $g.Clear([System.Drawing.Color]::White)
        $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0,0,$cw,$ch)), (New-Object System.Drawing.Rectangle($cx,$cy,$cw,$ch)), 'Pixel')

        $tw = 800; $th = [int]($ch * ($tw / $cw))
        $final = New-Object System.Drawing.Bitmap($tw, $th)
        $g2 = [System.Drawing.Graphics]::FromImage($final)
        $g2.InterpolationMode = 'HighQualityBicubic'
        $g2.DrawImage($cropped, 0, 0, $tw, $th)

        $final.Save((Join-Path $DEST $Name), [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $g2.Dispose(); $final.Dispose(); $g.Dispose(); $cropped.Dispose(); $img.Dispose(); $ms.Dispose()
        Write-Host "  [OK] $Name (y=$cy h=$ch)" -ForegroundColor Green
    } catch { Write-Host "  [ERR] $Name : $_" -ForegroundColor Red }
}

Write-Host "`n=== DECOUPE V9 ===`n" -ForegroundColor Cyan

$bf = (Get-ChildItem $SRC -Filter "burger*" -EA 0 | Select -First 1)
$nf = (Get-ChildItem $SRC -Filter "naan*" -EA 0 | Select -First 1)
$pf = (Get-ChildItem $SRC -Filter "plat*" -EA 0 | Select -First 1)
$sf = (Get-ChildItem $SRC -Filter "sandwich*" -EA 0 | Select -First 1)

# === BURGERS 1410x2000 === (OK on resserre juste un peu)
if ($bf) {
    Write-Host "[BURGERS]" -ForegroundColor Magenta
    $b = $bf.FullName
    Crop-HD $b "smash-double-s.jpg"  0.05 0.02 0.42 0.27
    Crop-HD $b "smash-smoke.jpg"     0.53 0.02 0.42 0.27
    Crop-HD $b "smash-big-smah.jpg"  0.05 0.34 0.42 0.27
    Crop-HD $b "smash-crispy.jpg"    0.53 0.34 0.42 0.27
    Crop-HD $b "smash-contry.jpg"    0.05 0.67 0.42 0.27
    Crop-HD $b "smash-le-s.jpg"      0.05 0.02 0.42 0.27
}

# === NAAN 1080x2392 ===
# DESCENDU de +8% vs V8. Le naan etait en bas du crop => on descend encore
if ($nf) {
    Write-Host "[NAAN]" -ForegroundColor Magenta
    $n = $nf.FullName
    Crop-HD $n "naanburger-big-naan.jpg"      0.08 0.33 0.38 0.08
    Crop-HD $n "naanburger-cowboy.jpg"         0.54 0.33 0.38 0.08
    Crop-HD $n "naanburger-crispy-chickn.jpg"  0.08 0.49 0.38 0.08
    Crop-HD $n "naanburger-chevre-miel.jpg"    0.54 0.49 0.38 0.08
    Crop-HD $n "naanburger-le-smashe.jpg"      0.08 0.66 0.38 0.10
    Crop-HD $n "naanburger-boursin.jpg"        0.54 0.66 0.38 0.10
}

# === PLATS 816x1118 === (Garde le meme)
if ($pf) {
    Write-Host "[PLATS]" -ForegroundColor Magenta
    $p = $pf.FullName
    Crop-HD $p "plat-escalope-milanaise.jpg"  0.08 0.03 0.38 0.15
    Crop-HD $p "plat-steak-cheval.jpg"        0.54 0.03 0.38 0.18
    Crop-HD $p "plat-poulet-normand.jpg"      0.08 0.35 0.38 0.15
    Crop-HD $p "plat-entrecote.jpg"           0.54 0.35 0.38 0.15
    Crop-HD $p "plat-escalope-gratinee.jpg"   0.08 0.67 0.38 0.15
    Crop-HD $p "plat-lasagne.jpg"             0.54 0.67 0.38 0.18
}

# === SANDWICHES 1080x2392 ===
# TRES DESCENDU : le sandwich etait TOUT en bas de V8 (top=0.29)
# => on passe a top=0.36 pour row 1, le sandwich doit etre au CENTRE
if ($sf) {
    Write-Host "[SANDWICHES]" -ForegroundColor Magenta
    $s = $sf.FullName
    Crop-HD $s "sandwich-americain.jpg"  0.08 0.36 0.38 0.07
    Crop-HD $s "sandwich-chicken.jpg"    0.54 0.36 0.38 0.07
    Crop-HD $s "sandwich-kebab.jpg"      0.08 0.50 0.38 0.07
    Crop-HD $s "sandwich-royal.jpg"      0.54 0.50 0.38 0.07
    Crop-HD $s "sandwich-special.jpg"    0.08 0.63 0.38 0.07
    Crop-HD $s "sandwich-boursin.jpg"    0.54 0.63 0.38 0.07
    Crop-HD $s "sandwich-wrap-1v.jpg"    0.08 0.36 0.38 0.07
    Crop-HD $s "sandwich-wrap-2v.jpg"    0.08 0.50 0.38 0.07
    Crop-HD $s "sandwich-wrap-3v.jpg"    0.54 0.50 0.38 0.07
}

Write-Host "`n=== TERMINE ===`n" -ForegroundColor Green
Write-Host "Appuie sur une touche..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
