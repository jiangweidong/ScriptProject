#!/bin/bash

# 检查参数数量是否正确
if [ "$#" -ne 2 ]; then
    echo "用法: $0 <目录路径> <文件后缀>"
    echo "例如: $0 /path/to/your/directory txt"
    exit 1
fi

# 获取参数
TARGET_DIR=$1
FILE_EXTENSION=$2

# 检查目录是否存在
if [ ! -d "$TARGET_DIR" ]; then
    echo "错误: 目录 '$TARGET_DIR' 不存在。"
    exit 1
fi

# 查找并删除指定后缀的文件
# -type f 表示只查找文件
# -name "*.$FILE_EXTENSION" 表示匹配指定后缀的文件
# -print -delete 会先打印出将要删除的文件名，然后执行删除操作
echo "将在目录 '$TARGET_DIR' 中查找并删除所有 *.$FILE_EXTENSION 文件..."
find "$TARGET_DIR" -type f -name "*.$FILE_EXTENSION" -print -delete

echo "操作完成。"
