# 医院管理系统

这是一个基于React、Node.js和PostgreSQL的现代化医院管理系统。

## 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS
- Radix UI组件库
- React Query
- Wouter (路由)
- React Hook Form
- Zod (表单验证)

### 后端
- Node.js
- Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- Passport.js (认证)
- WebSocket

## 项目结构

```
├── client/          # 前端代码
├── server/          # 后端代码
├── shared/          # 共享代码
└── attached_assets/ # 静态资源
```

## 功能特性

- 用户认证和授权
- 实时数据更新
- 响应式设计
- 表单验证
- 数据可视化
- 会话管理

## 安装说明

1. 克隆项目
```bash
git clone [项目地址]
cd [项目目录]
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件并配置必要的环境变量：
- 数据库连接信息
- 会话密钥
- 其他配置项

4. 数据库迁移
```bash
npm run db:push
```

## 开发

启动开发服务器：
```bash
npm run dev
```

### Windows系统特别说明
如果您使用的是Windows系统，请确保：
1. 已安装 `cross-env` 包（项目依赖中已包含）
2. 使用管理员权限运行命令提示符或PowerShell
3. 如果遇到权限问题，请检查Node.js的安装是否正确

## 构建

构建生产版本：
```bash
npm run build
```

## 生产环境运行

```bash
npm start
```

## 技术特点

- 使用TypeScript确保类型安全
- 采用Drizzle ORM进行数据库操作
- 使用WebSocket实现实时通信
- 基于Passport.js的认证系统
- 使用Tailwind CSS实现响应式设计
- 采用Radix UI组件库确保可访问性

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT 