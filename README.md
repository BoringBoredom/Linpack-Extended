# [Download](https://github.com/BoringBoredom/Linpack-Extended/archive/refs/heads/master.zip)

Linpack Extended is a stress test for 64-bit Intel processors. It is based on the latest Intel Math Kernel Library.

### Features

- chain different tests with different settings (time to run, problem size, leading dimension and alignment value)
- specify order of tests
- optionally track Min/Avg/Max GFlops per problem size
- optionally stop test when residuals mismatch
- optionally reduce command line output to decrease unnecessary resource usage at lower problem sizes

### Requirements

- Windows 7+ (also works on WinPE)
- [vcruntime140.dll](https://aka.ms/vs/17/release/vc_redist.x64.exe)
- 64-bit Intel processor

### Workarounds

- OMP Error: set `KMP_AFFINITY` in the config to an empty string -> `"KMP_AFFINITY": ""`
