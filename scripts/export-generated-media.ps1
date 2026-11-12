param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Slug,
  [Parameter(Mandatory = $true)][ValidateSet('desktop', 'mobile')][string]$Variant,
  [string]$Version = 'v3'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$sourcePath = (Resolve-Path -LiteralPath $Source).Path
$rawDir = Join-Path $root 'assets/generated/raw'
$webDir = Join-Path $root 'assets/generated/web'
New-Item -ItemType Directory -Force -Path $rawDir, $webDir | Out-Null

$width = if ($Variant -eq 'desktop') { 1600 } else { 800 }
$videoFilter = if ($Variant -eq 'desktop') {
  "scale=$width`:-2:flags=lanczos"
} else {
  'scale=800:1000:force_original_aspect_ratio=increase:flags=lanczos,crop=800:1000'
}
$rawName = "$Slug-$Variant-$Version.png"
$rawPath = Join-Path $rawDir $rawName
$webBase = Join-Path $webDir "$Slug-$Variant-$Version-$width"
Copy-Item -LiteralPath $sourcePath -Destination $rawPath -Force

& ffmpeg -hide_banner -loglevel error -y -i $sourcePath -vf $videoFilter -c:v libwebp -quality 84 "$webBase.webp"
if ($LASTEXITCODE -ne 0) { throw "WebP export failed for $Slug/$Variant" }

& ffmpeg -hide_banner -loglevel error -y -i $sourcePath -vf $videoFilter -c:v libsvtav1 -preset 8 -crf 34 -still-picture 1 "$webBase.avif"
if ($LASTEXITCODE -ne 0) { throw "AVIF export failed for $Slug/$Variant" }

Write-Output "exported $Slug $Variant -> $webBase.{avif,webp}"
