import akshare as ak
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# --- 1. 回测参数设置 ---
initial_capital = 100000.0
stock_code = "300433"
start_date = "20200101"
end_date = "20241231"
window = 20
threshold = 0.015 # 1.5%

# --- 2. 获取历史数据 ---
# 获取指数历史数据
try:
    # 使用 akshare 获取沪深300指数数据
    df = ak.index_zh_a_hist(symbol=stock_code, period="daily", start_date=start_date, end_date=end_date)
    # akshare 返回的列名是中文，我们将其重命名为英文
    df.rename(columns={'日期': 'date', '开盘': 'open', '收盘': 'close', '最高': 'high', '最低': 'low', '成交量': 'volume'}, inplace=True)
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
except Exception as e:
    print(f"数据获取失败: {e}")
    exit()

# --- 3. 计算交易指标 ---
# 计算移动平均线 (SMA)
df['sma'] = df['close'].rolling(window=window).mean()

# --- 4. 生成交易信号 ---
# 当价格低于SMA*(1-threshold)时买入, 高于SMA*(1+threshold)时卖出
df['signal'] = 0
df.loc[df['close'] < df['sma'] * (1 - threshold), 'signal'] = 1  # 买入信号
df.loc[df['close'] > df['sma'] * (1 + threshold), 'signal'] = -1 # 卖出信号

# --- 5. 执行回测 ---
cash = initial_capital
position = 0
portfolio = pd.DataFrame(index=df.index)
portfolio['holdings'] = 0.0
portfolio['cash'] = initial_capital
portfolio['total'] = initial_capital

for i in range(len(df)):
    # 在有SMA值之后才开始交易
    if not pd.isna(df['sma'][i]):
        # 买入信号: 当前无持仓且有买入信号
        if df['signal'][i] == 1 and position == 0:
            position = cash / df['close'][i] # 全仓买入
            cash = 0
        # 卖出信号: 当前有持仓且有卖出信号
        elif df['signal'][i] == -1 and position > 0:
            cash = position * df['close'][i] # 全仓卖出
            position = 0
    
    portfolio.loc[df.index[i], 'holdings'] = position * df['close'][i]
    portfolio.loc[df.index[i], 'cash'] = cash
    portfolio.loc[df.index[i], 'total'] = portfolio.loc[df.index[i], 'holdings'] + portfolio.loc[df.index[i], 'cash']

# --- 6. 计算并展示基准收益 ---
df['benchmark_return'] = df['close'] / df['close'].iloc[0]
portfolio['benchmark'] = initial_capital * df['benchmark_return']

# --- 7. 可视化收益曲线 ---
plt.style.use('seaborn-v0_8-darkgrid')
fig, ax = plt.subplots(figsize=(14, 7))

# 解决中文显示问题
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

ax.plot(portfolio.index, portfolio['total'], label='均值回归策略 (Mean Reversion Strategy)', color='r')
ax.plot(portfolio.index, portfolio['benchmark'], label='沪深300指数基准 (CSI 300 Benchmark)', color='b', linestyle='--')

# 格式化X轴日期
ax.xaxis.set_major_locator(mdates.YearLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
plt.xticks(rotation=45)

# 设置图表标题和标签
ax.set_title(f'均值回归策略回测 ({start_date} to {end_date})', fontsize=16)
ax.set_xlabel('日期 (Date)')
ax.set_ylabel('资产总值 (Total Value)')
ax.legend()
plt.tight_layout()

# 保存图表
plt.savefig('mean_reversion_backtest_chart.png')
print("回测完成，收益曲线图已保存为 mean_reversion_backtest_chart.png")

# 显示图表
plt.show()
