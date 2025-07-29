import akshare as ak
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import matplotlib.dates as mdates
from datetime import datetime

# --- 1. 回测参数设置 ---
initial_capital = 100000.0
stock_code = "300322"
start_date = "20240701"
# 结束日期为今天
end_date = datetime.now().strftime("%Y%m%d")

# --- 2. 获取历史数据 ---
try:
    # 使用 akshare 获取股票历史数据 (后复权)
    df = ak.stock_zh_a_hist(symbol=stock_code, period="daily", start_date=start_date, end_date=end_date, adjust="qfq")
    if not df.empty:
        # akshare 返回的列名是中文，我们将其重命名为英文
        df.rename(columns={'日期': 'date', '开盘': 'open', '收盘': 'close', '最高': 'high', '最低': 'low', '成交量': 'volume'}, inplace=True)
        df['date'] = pd.to_datetime(df['date'])
        df.set_index('date', inplace=True)
    else:
        print(f"在指定日期范围 {start_date} - {end_date} 内没有获取到股票 {stock_code} 的数据。")
        exit()
except Exception as e:
    print(f"数据获取失败: {e}")
    exit()

# --- 3. 执行买入并持有策略 ---
cash = initial_capital
position = 0
portfolio = pd.DataFrame(index=df.index)
portfolio['holdings'] = 0.0
portfolio['cash'] = initial_capital
portfolio['total'] = initial_capital

# 在第一个交易日全仓买入
if not df.empty:
    first_day_price = df['close'].iloc[0]
    position = cash / first_day_price
    cash = 0

    # 计算每日的投资组合价值
    for i in range(len(df)):
        current_price = df['close'].iloc[i]
        portfolio.loc[df.index[i], 'holdings'] = position * current_price
        portfolio.loc[df.index[i], 'cash'] = cash
        portfolio.loc[df.index[i], 'total'] = portfolio.loc[df.index[i], 'holdings'] + portfolio.loc[df.index[i], 'cash']

# --- 4. 设置动画 ---
plt.style.use('seaborn-v0_8-darkgrid')
fig, ax = plt.subplots(figsize=(14, 7))

# 解决中文显示问题
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# 初始化绘图元素
line, = ax.plot([], [], lw=2, label='投资组合价值', color='r')
ax.set_xlim(df.index[0], df.index[-1])
# 设置Y轴范围，留出一些边距
y_min = portfolio['total'].min() * 0.95
y_max = portfolio['total'].max() * 1.05
ax.set_ylim(y_min, y_max)

# 设置图表标题和标签
ax.set_title(f'股票 {stock_code} 买入并持有策略回测动画', fontsize=16)
ax.set_xlabel('日期 (Date)')
ax.set_ylabel('资产总值 (Total Value)')
ax.legend(loc='upper left')

# 格式化X轴日期
ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
plt.xticks(rotation=45)

# 添加一个文本框来显示当前日期和总资产
info_text = ax.text(0.05, 0.95, '', transform=ax.transAxes, ha='left', va='top', fontsize=12, bbox=dict(boxstyle='round,pad=0.5', fc='yellow', alpha=0.5))

# 初始化函数
def init():
    line.set_data([], [])
    info_text.set_text('')
    return line, info_text

# 动画更新函数
def update(frame):
    # 绘制到第 frame 帧
    x = df.index[:frame+1]
    y = portfolio['total'][:frame+1]
    line.set_data(x, y)
    
    # 更新文本信息
    current_date = df.index[frame].strftime('%Y-%m-%d')
    current_total = portfolio['total'].iloc[frame]
    info_text.set_text(f'日期: {current_date}\n总资产: {current_total:,.2f} 元')
    
    return line, info_text

# 创建动画
# frames 是动画的总帧数，这里我们设置为数据的天数
ani = animation.FuncAnimation(fig, update, frames=len(df), init_func=init, blit=True, interval=100)

# 保存动画为 GIF
output_filename = f'stock_backtest_{stock_code}.gif'
try:
    ani.save(output_filename, writer='pillow', fps=10)
    print(f"回测动画已保存为 {output_filename}")
except Exception as e:
    print(f"保存GIF失败: {e}")
    print("请确保已安装 Pillow: pip install Pillow")

# 显示图表 (可选)
# plt.show()
