# 开发指南

## 环境要求

- Node.js >= 18
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 腾讯地图 [WebService API Key](https://lbs.qq.com/dev/console/application/mine)（需开启 WebServiceAPI 权限）

## 安装与配置

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件，填入腾讯地图 API Key：

```env
VITE_MAP_KEY=你的腾讯地图WebServiceAPI_Key
```

> API Key 在代码中通过 `import.meta.env.VITE_MAP_KEY` 读取（`src/utils/map.ts`）。

### 配置微信服务器域名

登录微信公众平台 → 开发管理 → 开发设置 → 服务器域名，在 **request 合法域名** 中添加：

```
https://apis.map.qq.com
```

## 常用命令

```bash
# 开发（微信小程序）
npm run dev:mp-weixin
# 编译产物在 dist/dev/mp-weixin，用微信开发者工具打开

# 生产构建
npm run build:mp-weixin

# 类型检查
npm run type-check

# H5 预览（调试用）
npm run dev:h5
```

## 调试方法

1. 运行 `npm run dev:mp-weixin`
2. 打开微信开发者工具，导入 `dist/dev/mp-weixin` 目录
3. 代码修改后会自动热更新
4. 真机测试：微信开发者工具 → 预览 → 手机扫码
5. 模拟定位：微信开发者工具支持自定义 GPS 坐标

## 开发注意事项

- **不要直接修改 `dist/` 目录**，所有修改在 `src/` 中进行
- **腾讯地图 API Key** 通过 `.env` 文件管理，不要提交到公开仓库
- **`pages.json`** 修改后需要重新运行 dev 命令
- **`uni.getLocation`** 需要在小程序后台配置定位接口权限
- **地图组件 `<map>`** 是微信小程序原生组件，层级最高
- 产物路径：
  - 开发：`dist/dev/mp-weixin`
  - 生产：`dist/build/mp-weixin`

## 安全注意

- `.env` 文件（含 API Key）不应提交到版本控制
- 后续接入 AI API 时，Key 必须放在云函数中，不能暴露给前端
