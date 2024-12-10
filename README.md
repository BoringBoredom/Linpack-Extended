# [Download](https://github.com/BoringBoredom/Linpack-Extended/archive/refs/heads/master.zip)

Linpack Extended is a stress test based on the Intel Math Kernel Library.

### Features

- chain different tests with different settings (time to run, problem size, leading dimension and alignment value)
- specify order of tests
- optionally track Min/Avg/Max GFlops per problem size
- optionally stop test when residuals mismatch
- optionally reduce command line output to decrease unnecessary resource usage at lower problem sizes

### Requirements

- [vcruntime140.dll](https://aka.ms/vs/17/release/vc_redist.x64.exe)

### Workarounds

- OMP Error: set `KMP_AFFINITY` in the config to an empty string -> `"KMP_AFFINITY": ""`
