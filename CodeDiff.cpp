#include <algorithm>
#include <ctime>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

int main(int argc, char *argv[])
{
    if (argc < 3)
    {
        std::cerr << "Usage: CodeDiff <file1> <file2>\n";
        return 2;
    }

    std::ifstream file1(argv[1]);
    std::ifstream file2(argv[2]);

    if (!file1 || !file2)
    {
        std::cerr << "Error: could not open input file\n";
        return 2;
    }

    std::vector<std::string> file1_lines;
    std::vector<std::string> file2_lines;
    std::string line;

    const clock_t start = clock();

    while (std::getline(file1, line))
    {
        file1_lines.push_back(line);
    }
    while (std::getline(file2, line))
    {
        file2_lines.push_back(line);
    }

    bool equal = file1_lines.size() == file2_lines.size();
    if (equal)
    {
        for (std::size_t i = 0; i < file1_lines.size(); ++i)
        {
            if (file1_lines[i] != file2_lines[i])
            {
                equal = false;
                break;
            }
        }
    }

    const clock_t end = clock();
    const double elapsed_ms =
        (end - start) / static_cast<double>(CLOCKS_PER_SEC) * 1000.0;

    std::cout << "Time: " << elapsed_ms << "ms\n";
    std::cout << (equal ? 1 : 0) << '\n';
    return equal ? 0 : 1;
}
