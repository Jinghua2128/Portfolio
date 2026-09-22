[CmdletBinding()]
param(
    [string]$UpdateDescription,
    [datetime]$ReleaseDate = (Get-Date),
    [string]$ArchiveName
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
if ([string]::IsNullOrWhiteSpace($ArchiveName)) {
    if ($UpdateDescription -cnotmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') {
        throw "Provide -UpdateDescription as a specific lowercase hyphenated change, for example display-name-only-on-create-account."
    }
    $dateLabel = $ReleaseDate.ToString('dd-MMMM-yyyy', [System.Globalization.CultureInfo]::InvariantCulture)
    $ArchiveName = "$dateLabel-$UpdateDescription.zip"
} elseif (-not [string]::IsNullOrWhiteSpace($UpdateDescription)) {
    throw "Use -UpdateDescription with optional -ReleaseDate, or -ArchiveName, not both."
}
$nameMatch = [regex]::Match($ArchiveName, '^(?<date>\d{2}-[A-Z][a-z]+-\d{4})-[a-z0-9]+(?:-[a-z0-9]+)*\.zip$')
$parsedReleaseDate = [datetime]::MinValue
if (-not $nameMatch.Success -or -not [datetime]::TryParseExact(
    $nameMatch.Groups['date'].Value, 'dd-MMMM-yyyy', [System.Globalization.CultureInfo]::InvariantCulture,
    [System.Globalization.DateTimeStyles]::None, [ref]$parsedReleaseDate
)) {
    throw "Use DD-Month-YYYY-exact-update.zip, for example 08-September-2026-display-name-only-on-create-account.zip. Paths are not allowed."
}
$archivePath = Join-Path $PSScriptRoot $ArchiveName
$checksumPath = "$archivePath.sha256"

$rootFiles = @(
    "index.html",
    "about.html",
    "projects.html",
    "blog.html",
    "contact.html",
    "immersion.html",
    "styles.css",
    "script.js",
    "immersion.css",
    "immersion.js",
    "editor-tools.css",
    "editor-tools.js",
    "image-upload.css",
    "image-upload.js",
    "content-order.js",
    "project-highlights.js",
    "project-highlights.css",
    "project-catalog.js",
    "project-management.js",
    "projects-firebase.js",
    "blog-firebase.js",
    "firebase-config.js"
)

# Explicit allowlist: never recurse through media or accidentally package private portraits.
$assetFiles = @(
    "imgs/Logo/icon.ico", "imgs/Logo/logo.png", "imgs/Blogs/GGF/GGF_grp_photo.jpg",
    "imgs/Blogs/OIP/OIP_grp_photo.jpg", "imgs/Blogs/EchoWorks/photo.JPG",
    "imgs/Projects/BurntConesRevamp/BurntConesRevamp_HomePage.jpg",
    "imgs/Projects/CarbonCreative/CarbonCreative_HomePage.jpg",
    "imgs/Projects/EchoWorks/EchoWorks_HomePage.jpg"
)
$sideFiles = @("index.html", "about.html", "projects.html", "blog.html", "contact.html", "styles.css", "script.js", "home-projects.js", "projects-firebase.js", "blog-firebase.js", "firebase-config.js") |
    ForEach-Object { "editorial-portfolio/$_" }
$deploymentFiles = @($rootFiles) + @($assetFiles) + @($sideFiles)

foreach ($relativePath in $deploymentFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $projectRoot $relativePath))) {
        throw "Missing required deployment source: $relativePath"
    }
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
if ((Test-Path -LiteralPath $archivePath) -or (Test-Path -LiteralPath $checksumPath)) {
    throw "Archive already exists. Use the actual date and a distinct update description; previous packages are preserved."
}

$allowedPaths = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
$deploymentFiles | ForEach-Object { [void]$allowedPaths.Add($_.Replace('\', '/')) }
foreach ($relativePath in $deploymentFiles | Where-Object { $_ -like '*.html' }) {
    $sourcePath = Join-Path $projectRoot $relativePath
    $content = Get-Content -Raw -LiteralPath $sourcePath
    foreach ($match in [regex]::Matches($content, '(?:src|href)\s*=\s*["'']([^"'']+)["'']')) {
        $reference = $match.Groups[1].Value
        if ($reference -match '^(?:[a-z]+:|//|#)' -or [string]::IsNullOrWhiteSpace($reference)) { continue }
        $reference = ($reference -split '[?#]')[0]
        $resolved = [System.IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $sourcePath) $reference))
        $archiveReference = [System.IO.Path]::GetRelativePath($projectRoot, $resolved).Replace('\', '/')
        if (-not $allowedPaths.Contains($archiveReference)) { throw "Unpackaged reference in ${relativePath}: $reference" }
    }
}

$archive = [System.IO.Compression.ZipFile]::Open($archivePath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($relativePath in $deploymentFiles) {
        $sourcePath = Join-Path $projectRoot $relativePath
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $archive,
            $sourcePath,
            $relativePath.Replace("\", "/"),
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }

}
finally {
    $archive.Dispose()
}

$archive = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
try {
    $entryNames = @($archive.Entries | ForEach-Object { $_.FullName.Replace("\", "/") })
    if ($entryNames -notcontains "index.html") {
        throw "Deployment archive does not contain index.html at its root."
    }
    if ($entryNames -notcontains "editorial-portfolio/index.html") {
        throw "Deployment archive does not contain the editorial side site."
    }

    $privatePattern = '(?i)(^|/)(\.git|node_modules|deploy|\.qa|\.tmp|browser-profile|chrome-profile)(/|$)|(^|/)(\.env|firebase-debug\.log|Me_np\.jpg|HANDOFF\.md|AGENTS\.md)$|\.(zip|sha256)$'
    $privateEntries = @($entryNames | Where-Object { $_ -match $privatePattern })
    if ($privateEntries.Count -gt 0) {
        throw "Private or local-only entries found in deployment archive:`n$($privateEntries -join "`n")"
    }
}
finally {
    $archive.Dispose()
}

$hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $archivePath).Hash.ToLowerInvariant()
Set-Content -LiteralPath $checksumPath -Value "$hash  $([System.IO.Path]::GetFileName($archivePath))" -Encoding ascii

Write-Output "Created: $archivePath"
Write-Output "Entries: $($entryNames.Count)"
Write-Output "SHA256: $hash"
Write-Output "Private-data audit: passed"
Write-Output "Local HTML reference audit: passed"
