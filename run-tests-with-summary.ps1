# run-tests-with-summary.ps1
# PowerShell script to run tests and generate both full and summary output files

Write-Host "Running tests and generating summary..."
Set-Location $PSScriptRoot

# Run the tests and capture the output
$testOutput = npm test | Out-String

# Save the full output for detailed inspection if needed
$testOutput | Out-File -FilePath test_output_full.txt -Encoding utf8

# Extract summary information
$summary = @()
$summary += "TEST SUMMARY"
$summary += "============"
$summary += ""

# Extract Pass/Fail statistics
$testSuites = $testOutput | Select-String -Pattern "Test Suites:" -SimpleMatch
$tests = $testOutput | Select-String -Pattern "Tests:" -SimpleMatch
$snapshots = $testOutput | Select-String -Pattern "Snapshots:" -SimpleMatch
$time = $testOutput | Select-String -Pattern "Time:" -SimpleMatch

if ($testSuites) { $summary += $testSuites -join "`n" }
if ($tests) { $summary += $tests -join "`n" }
if ($snapshots) { $summary += $snapshots -join "`n" }
if ($time) { $summary += $time -join "`n" }

$summary += ""
$summary += "FAILED TESTS"
$summary += "============"

# Find failed tests with context (include a few lines after each FAIL)
$failedTests = $testOutput | Select-String -Pattern "FAIL" -Context 0,2
if ($failedTests) {
    $summary += $failedTests -join "`n"
} else {
    $summary += "No failed tests!"
}

$summary += ""
$summary += "COVERAGE SUMMARY"
$summary += "================"

# Extract coverage information
$coverage = $testOutput | Select-String -Pattern "All files" -Context 0,5
if ($coverage) {
    $summary += $coverage -join "`n"
}

# Save the summary to a separate file
$summary | Out-File -FilePath test_summary.txt -Encoding utf8

# Create a bat file wrapper for easy execution from Windows Explorer
$batContent = @"
@echo off
powershell -ExecutionPolicy Bypass -File "%~dp0run-tests-with-summary.ps1"
pause
"@

$batContent | Out-File -FilePath run-tests-with-summary.bat -Encoding ascii

Write-Host "Test execution completed."
Write-Host "Full results in test_output_full.txt"
Write-Host "Summary in test_summary.txt"
Write-Host ""
Write-Host "You can also run tests with summary by double-clicking run-tests-with-summary.bat"
