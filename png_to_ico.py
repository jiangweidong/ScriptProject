import argparse
from PIL import Image
import os

def convert_png_to_ico(png_path, ico_path):
    """
    将 PNG 图像转换为 ICO 文件。

    参数:
        png_path (str): 输入 PNG 文件的路径。
        ico_path (str): 输出 ICO 文件的路径。
    """
    if not os.path.exists(png_path):
        print(f"错误：在 {png_path} 未找到输入文件")
        return

    try:
        img = Image.open(png_path)
        # ICO 文件通常包含多种尺寸的图像。
        # Pillow 可以根据源文件自动选择尺寸，或者您可以指定尺寸列表。
        # 例如: sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
        img.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (256, 256)], bitmap_format='bmp')
        print(f"成功将 {png_path} 转换为 {ico_path}")
    except Exception as e:
        print(f"发生错误: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="将 PNG 图像转换为 ICO 文件。")
    parser.add_argument("png_file", help="输入 PNG 文件的路径。")
    parser.add_argument("ico_file", help="输出 ICO 文件的路径。")

    args = parser.parse_args()

    convert_png_to_ico(args.png_file, args.ico_file)
