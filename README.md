# [Download](https://github.com/BoringBoredom/Linpack-Extended/archive/refs/heads/master.zip)

Linpack Extended is a stress test for 64-bit Intel processors. It is based on the [Intel Math Kernel Library](https://software.intel.com/content/www/us/en/develop/articles/intel-mkl-benchmarks-suite.html).

### Features
- chain different tests with different settings (time to run, problem size, leading dimension, alignment value and library version)
- specify order of tests
- optionally track Min/Avg/Max GFlops per problem size
- optionally stop test when residuals mismatch
- optionally reduce command line output to decrease unnecessary resource usage at lower problem sizes

#### List of library versions
- 2018.3.011
- 2019.6.005
- 2020.2.001
- 2020.4.003
- 2021.1.2.001
- 2021.2.0.109
- 2021.3.1.0

### Requirements
- Windows 7+ (also works on WinPE)
- vcruntime140.dll ([Visual C++ 2015-2019](https://support.microsoft.com/en-us/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0))
- 64-bit Intel processor