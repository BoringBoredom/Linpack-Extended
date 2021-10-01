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
- vcruntime140.dll ([Visual C++ 2015-2019](https://support.microsoft.com/en-us/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0))
- 64-bit Intel processor