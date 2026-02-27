# Likes Training Planner Skill

为 My Likes 运动平台生成训练计划并推送到日历的 OpenClaw Skill。

## 功能

- 根据用户运动数据生成个性化训练计划
- 自动转换为 Likes 系统支持的课表格式
- 一键推送到 Likes 日历
- 支持跑步、骑行、游泳、力量训练
- **OpenClaw Skill Center 集成** - 图形化配置界面

## 安装

### 方式 1：一键安装（推荐）

```bash
curl -fsSL https://raw.githubusercontent.com/chenwynn/likes-training-planner/main/install.sh | bash
```

### 方式 2：手动安装

1. 下载 skill 文件：
```bash
curl -L -o likes-training-planner.skill \
  https://github.com/chenwynn/likes-training-planner/releases/latest/download/likes-training-planner.skill
```

2. 解压到 OpenClaw skills 目录：
```bash
unzip likes-training-planner.skill -d /opt/homebrew/lib/node_modules/openclaw/skills/
```

3. 重启 OpenClaw

### 方式 3：源码安装

```bash
git clone https://github.com/chenwynn/likes-training-planner.git
cp -r likes-training-planner /opt/homebrew/lib/node_modules/openclaw/skills/
```

## 配置

### 方式 1：OpenClaw Skill Center（推荐）

1. 打开 OpenClaw Control UI (http://127.0.0.1:18789)
2. 点击 **Skills**
3. 找到 **likes-training-planner** 🏃
4. 点击 **Configure**
5. 在表单中输入你的 **Likes API Key**
6. 保存

<img src="https://github.com/chenwynn/likes-training-planner/raw/main/assets/skill-center.png" width="600" alt="Skill Center Configuration">

### 方式 2：命令行配置

```bash
cd /opt/homebrew/lib/node_modules/openclaw/skills/likes-training-planner
node scripts/configure.cjs
```

### 获取 API Key

1. 登录 [my.likes.com.cn](https://my.likes.com.cn)
2. 进入 **设置 → API 文档**
3. 复制你的 API Key

### 其他配置方式

**环境变量：**
```bash
export LIKES_API_KEY=your-api-key
```

**命令行参数：**
```bash
node scripts/push_plans.cjs --key your-api-key plans.json
```

## 使用方法

配置完成后，对 OpenClaw 说：

> "帮我生成一个 4 周马拉松备赛计划"
> 
> "根据我的运动记录，生成下周的训练计划"
> 
> "推送计划到我的 Likes 日历"

## 课表代码格式

Likes 系统的 `name` 字段使用特定格式：

```
# 简单任务
duration@(type+range)
30min@(HRR+1.0~2.0)

# 间歇组
{task1;task2}xN
{5min@(HRR+3.0~4.0);1min@(rest)}x3

# 完整示例
10min@(HRR+1.0~2.0);{1000m@(VDOT+4.0~5.0);2min@(rest)}x5;10min@(HRR+1.0~2.0)
```

详见 `references/code-format.md`

## 文件结构

```
likes-training-planner/
├── SKILL.md                    # Skill 主文档（含 metadata）
├── README.md                   # 使用说明
├── install.sh                  # 一键安装脚本
├── references/
│   ├── api-docs.md            # API 文档
│   ├── code-format.md         # 课表代码格式规范
│   └── sport-examples.md      # 运动示例
└── scripts/
    ├── configure.cjs          # ⭐ 交互式配置向导
    ├── set-config.cjs         # 快速配置工具
    ├── push_plans.cjs         # 推送脚本
    └── push_plans.sh          # Shell 包装
```

## 更新日志

### v1.2
- 添加 OpenClaw Skill Center 支持
- 图形化配置界面
- 自动检测 Node.js 模块类型（.cjs）

### v1.1
- 新增配置向导
- 支持多种认证方式

### v1.0
- 初始版本

## License

MIT
