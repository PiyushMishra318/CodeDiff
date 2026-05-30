# CodeDiff

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![C++](https://img.shields.io/badge/C%2B%2B-17-blue.svg)](CMakeLists.txt)

Small **C++** command-line tool that compares two text files line-by-line and reports whether they are equal.

Prints elapsed time in milliseconds, then `1` for equal or `0` for different. Exit code is `0` when files match and `1` when they differ.

## Requirements

- C++17 compiler (MSVC, GCC, or Clang)
- CMake 3.16+

## Build

```bash
git clone git@github.com:PiyushMishra318/CodeDiff.git
cd CodeDiff
cmake -B build -S .
cmake --build build
```

On Windows with Visual Studio, open `CodeDiff.sln` or generate a VS solution:

```bash
cmake -B build -S . -G "Visual Studio 17 2022"
cmake --build build --config Release
```

## Web demo (Vercel)

Paste two code snippets at `/` to compare them line-by-line (same semantics as the C++ CLI). Deploy:

```bash
npx vercel --prod
```

API: `POST /api/compare` with JSON `{ "left": "...", "right": "..." }`.

## CLI usage

```bash
./build/CodeDiff file1.txt file2.txt
```

Example output:

```text
Time: 0.42ms
1
```

## Tests

```bash
cmake --build build
ctest --test-dir build --output-on-failure
```

## Project layout

```text
.
├── CodeDiff.cpp      # line-by-line file comparison
├── CMakeLists.txt    # build and ctest definitions
└── testdata/         # sample fixtures
```

## License

MIT © 2026 [Piyush Mishra](https://github.com/PiyushMishra318)
