
$ErrorActionPreference = 'Stop'
$pp = New-Object -ComObject PowerPoint.Application
try {
  foreach ($n in @(7,8,9,10,12,13)) {
    $src = Join-Path 'F:\Dropbox\claude-體育測驗與統計\課程網站\_toolkit' ("ch$n\slides\deck.pptx")
    $dst = Join-Path 'F:\Dropbox\claude-體育測驗與統計\課程網站\_toolkit' ("ch$n\slides\deck.pdf")
    $pres = $pp.Presentations.Open($src, $true, $false, $false)
    $pres.SaveAs($dst, 32)
    $pres.Close()
    Write-Output "ch$n ok"
  }
} finally { $pp.Quit() }
