import numpy as np
import matplotlib.pyplot as plt

# 设置matplotlib支持中文显示
plt.rcParams['font.sans-serif'] = ['SimHei']  # 指定默认字体
plt.rcParams['axes.unicode_minus'] = False  # 解决保存图像是负号'-'显示为方块的问题

# 设置x轴的范围和点数
x = np.linspace(-2 * np.pi, 2 * np.pi, 400)

# 计算sin, cos, tan值
y_sin = np.sin(x)
y_cos = np.cos(x)
y_tan = np.tan(x)

# 为了更好地显示tan函数，限制y轴范围
# tan在pi/2的奇数倍处有垂直渐近线，会导致y值无穷大
# 通过将这些点的值设置为NaN，可以在图中产生断点
y_tan[np.abs(np.cos(x)) < 1e-10] = np.nan

# 创建图形和子图
plt.figure(figsize=(12, 8))

# 绘制sin函数
plt.subplot(3, 1, 1)
plt.plot(x, y_sin, label='sin(x)', color='blue')
plt.title('正弦函数 (Sine Function)')
plt.xlabel('x (radians)')
plt.ylabel('sin(x)')
plt.grid(True)
plt.legend()

# 绘制cos函数
plt.subplot(3, 1, 2)
plt.plot(x, y_cos, label='cos(x)', color='red')
plt.title('余弦函数 (Cosine Function)')
plt.xlabel('x (radians)')
plt.ylabel('cos(x)')
plt.grid(True)
plt.legend()

# 绘制tan函数
plt.subplot(3, 1, 3)
plt.plot(x, y_tan, label='tan(x)', color='green')
plt.title('正切函数 (Tangent Function)')
plt.xlabel('x (radians)')
plt.ylabel('tan(x)')
plt.ylim(-5, 5)  # 限制y轴范围以便观察
plt.grid(True)
plt.legend()

# 调整子图之间的间距
plt.tight_layout()

# 显示图形
plt.show()
